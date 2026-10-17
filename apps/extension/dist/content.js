(() => {
  // src/content.ts
  (function() {
    const API_BASE_URL = "http://localhost:3001";
    const FALLBACK_API_URL = "http://localhost:3000";
    const HUD_CONTAINER_ID = "tubepilot-hud-root";
    const HEADER_HUD_CONTAINER_ID = "tubepilot-header-hud-root";
    let currentChannelKey = null;
    let isFetching = false;
    let isCollapsed = false;
    let workspaceStatus = null;
    function cleanLegacyVidoorElements() {
      const legacySelectors = [
        "#vidoor-hud",
        "#vidoor-container",
        ".vidoor-container",
        ".vidoor-hud",
        ".vidoor-widget",
        ".vidoor-badge",
        "[data-vidoor]"
      ];
      legacySelectors.forEach((sel) => {
        document.querySelectorAll(sel).forEach((el) => el.remove());
      });
    }
    async function fetchWorkspaceStatus() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/extension/status`);
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            workspaceStatus = data;
            return data;
          }
        }
      } catch {
      }
      try {
        const resFallback = await fetch(`${FALLBACK_API_URL}/api/extension/status`);
        if (resFallback.ok) {
          const data = await resFallback.json();
          if (data.success) {
            workspaceStatus = data;
            return data;
          }
        }
      } catch {
      }
      return null;
    }
    function getActiveChannelIdentifier() {
      const { hostname, pathname } = window.location;
      if (hostname === "studio.youtube.com") {
        const parts = pathname.split("/").filter(Boolean);
        if (parts[0] === "channel" && parts[1]) {
          return { type: "studio", identifier: parts[1] };
        }
        return { type: "studio", identifier: "studio_personal" };
      }
      const segments = pathname.split("/").filter(Boolean);
      if (!segments.length) return { type: null, identifier: null };
      if (segments[0].startsWith("@")) {
        return { type: "handle", identifier: segments[0] };
      }
      if (segments[0] === "channel" && segments[1]) {
        return { type: "channelId", identifier: segments[1] };
      }
      if ((segments[0] === "c" || segments[0] === "user") && segments[1]) {
        return { type: "custom", identifier: segments[1] };
      }
      if (pathname === "/watch") {
        const ownerEl = document.querySelector(
          "ytd-watch-metadata ytd-channel-name a, #owner ytd-channel-name a, ytd-video-owner-renderer a"
        );
        if (ownerEl && ownerEl.href) {
          try {
            const ownerUrl = new URL(ownerEl.href);
            const ownerSegments = ownerUrl.pathname.split("/").filter(Boolean);
            if (ownerSegments[0]) {
              return { type: "watch", identifier: ownerSegments[0] };
            }
          } catch {
          }
        }
      }
      return { type: null, identifier: null };
    }
    function isWorkspaceChannel(identifier, channelTitle) {
      if (!workspaceStatus?.connected || !workspaceStatus.channel) return false;
      const wsChannel = workspaceStatus.channel;
      if (identifier === "studio_personal") return true;
      if (identifier && wsChannel.id && identifier.toLowerCase() === wsChannel.id.toLowerCase()) return true;
      const wsHandle = (wsChannel.handle || "").toLowerCase().replace(/^@/, "");
      const curHandle = (identifier || "").toLowerCase().replace(/^@/, "");
      if (wsHandle && curHandle && wsHandle === curHandle) return true;
      if (channelTitle && wsChannel.title) {
        if (channelTitle.trim().toLowerCase() === wsChannel.title.trim().toLowerCase()) return true;
      }
      return false;
    }
    async function fetchChannelTelemetry(identifier) {
      const query = encodeURIComponent(identifier);
      try {
        const res = await fetch(`${API_BASE_URL}/api/channels/audit?q=${query}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) return data.data;
        }
      } catch {
      }
      try {
        const resFallback = await fetch(`${FALLBACK_API_URL}/api/channels/audit?q=${query}`);
        if (resFallback.ok) {
          const data = await resFallback.json();
          if (data.success && data.data) return data.data;
        }
      } catch {
      }
      return null;
    }
    function injectChannelHeaderHUD(data, meta, isWs) {
      cleanLegacyVidoorElements();
      const targetParent = document.querySelector("ytd-c4-tabbed-header-renderer #page-header") || document.querySelector("ytd-c4-tabbed-header-renderer #inner-header-container") || document.querySelector("ytd-c4-tabbed-header-renderer") || document.querySelector("#channel-header") || document.querySelector("ytd-tabbed-page-header");
      if (!targetParent) return;
      let banner = document.getElementById(HEADER_HUD_CONTAINER_ID);
      if (!banner) {
        banner = document.createElement("div");
        banner.id = HEADER_HUD_CONTAINER_ID;
        banner.className = "tp-channel-header-hud";
        targetParent.appendChild(banner);
      }
      const channelTitle = data?.channelTitle || meta.identifier || "Channel";
      const channelHandle = data?.channelHandle || (meta.identifier?.startsWith("@") ? meta.identifier : `@${meta.identifier || "channel"}`);
      const subscribers = data?.subscribers || "Real-time";
      const currentVph = data?.vph?.currentVph || "1,150";
      const rpmBadge = data?.monetization?.regionBadge || "Localized RPM";
      const estRpm = data?.monetization?.estimatedRpm || "$0.65";
      const monthlyRange = data?.monetization?.projectedMonthlyMin && data?.monetization?.projectedMonthlyMax ? `${data.monetization.projectedMonthlyMin} \u2013 ${data.monetization.projectedMonthlyMax}` : "$380 \u2013 $1,250";
      const score = data?.overallScore || 88;
      const dashboardUrl = `${API_BASE_URL}/uz/dashboard?audit_handle=${encodeURIComponent(channelHandle)}`;
      banner.innerHTML = `
      <div class="tp-header-hud-inner">
        <div class="tp-header-hud-left">
          <div class="tp-header-hud-logo">
            <svg style="width:16px;height:16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div class="tp-header-hud-info">
            <div class="tp-header-hud-title-row">
              <span class="tp-header-hud-name">TubePilot AI Growth HUD</span>
              ${isWs ? `<span class="tp-workspace-badge-connected">\u{1F7E2} Connected Workspace</span>` : `<span class="tp-workspace-badge-competitor">\u26A1 Competitor Channel Telemetry</span>`}
            </div>
            <span class="tp-header-hud-subtext">${channelTitle} (${channelHandle}) \xB7 Subscribers: <strong>${subscribers}</strong></span>
          </div>
        </div>

        <div class="tp-header-hud-metrics">
          <div class="tp-header-metric-pill">
            <span class="tp-header-metric-label">\u26A1 Views Velocity</span>
            <span class="tp-header-metric-value emerald">${currentVph} VPH</span>
          </div>
          <div class="tp-header-metric-pill">
            <span class="tp-header-metric-label">\u{1F4B0} Est. RPM (${rpmBadge})</span>
            <span class="tp-header-metric-value sky">${estRpm} (${monthlyRange}/mo)</span>
          </div>
          <div class="tp-header-metric-pill">
            <span class="tp-header-metric-label">\u{1F3AF} Growth Score</span>
            <span class="tp-header-metric-value rose">${score}/100</span>
          </div>
        </div>

        <div class="tp-header-hud-actions">
          <a href="${dashboardUrl}" target="_blank" class="tp-btn-header-dashboard">
            <span>\u{1F680} Open in TubePilot Dashboard</span>
          </a>
        </div>
      </div>
    `;
    }
    function injectFloatingHUD(data, channelMeta, isWs) {
      cleanLegacyVidoorElements();
      let container = document.getElementById(HUD_CONTAINER_ID);
      if (!container) {
        container = document.createElement("div");
        container.id = HUD_CONTAINER_ID;
        document.body.appendChild(container);
      }
      const isStudio = channelMeta.type === "studio";
      const channelTitle = data?.channelTitle || channelMeta.identifier || "Active Channel";
      const channelHandle = data?.channelHandle || (channelMeta.identifier?.startsWith("@") ? channelMeta.identifier : `@${channelMeta.identifier || "channel"}`);
      const subscribers = data?.subscribers || "Real-time";
      const totalViews = data?.totalViews || "Real-time";
      const currentVph = data?.vph?.currentVph || "Analyzing";
      const peakVph = data?.vph?.peakVph || "Top";
      const rpmBadge = data?.monetization?.regionBadge || "Localized RPM";
      const estRpm = data?.monetization?.estimatedRpm || "$0.65";
      const monthlyRange = data?.monetization?.projectedMonthlyMin && data?.monetization?.projectedMonthlyMax ? `${data.monetization.projectedMonthlyMin} \u2013 ${data.monetization.projectedMonthlyMax}` : "Estimating...";
      const grade = data?.grade || "A";
      const score = data?.overallScore || 88;
      const avatarUrl = data?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80";
      const studioUrl = `${API_BASE_URL}/uz/dashboard?audit_handle=${encodeURIComponent(channelHandle)}`;
      container.innerHTML = `
      <div class="tp-hud-card ${isCollapsed ? "tp-collapsed" : ""}">
        <!-- Top Drag Header -->
        <div class="tp-hud-header">
          <div class="tp-brand-wrap">
            <div class="tp-logo-badge">
              <svg class="tp-logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div class="tp-brand-title">
              <span class="tp-name">TubePilot <span class="tp-pill">AI</span></span>
              <span class="tp-status-live">
                <span class="tp-dot"></span> ${isWs ? "Your Workspace" : "Growth Telemetry"}
              </span>
            </div>
          </div>
          <div class="tp-header-actions">
            <button id="tp-btn-toggle" class="tp-icon-btn" title="${isCollapsed ? "Kengaytirish" : "Yig\u02BBish"}">
              ${isCollapsed ? "\u25A1" : "\u2013"}
            </button>
            <button id="tp-btn-close" class="tp-icon-btn" title="Yopish">\u2715</button>
          </div>
        </div>

        ${isCollapsed ? `
          <div class="tp-collapsed-bar" id="tp-collapsed-bar">
            <span class="tp-collapsed-title">${channelTitle}</span>
            <span class="tp-collapsed-vph">\u26A1 ${currentVph} VPH</span>
          </div>
        ` : `
          <!-- Body Content -->
          <div class="tp-hud-body">
            <!-- Channel Profile Bar -->
            <div class="tp-channel-profile">
              <img src="${avatarUrl}" alt="${channelTitle}" class="tp-channel-avatar" />
              <div class="tp-channel-details">
                <div class="tp-channel-name" title="${channelTitle}">${channelTitle}</div>
                <div class="tp-channel-sub">${channelHandle}</div>
              </div>
              <div class="tp-grade-badge ${grade === "A+" ? "tp-grade-apex" : ""}">${grade}</div>
            </div>

            <!-- Workspace Status Badge -->
            <div style="margin-bottom: 8px;">
              ${isWs ? `<span class="tp-workspace-badge-connected" style="font-size:10px;">\u{1F7E2} Your Connected Workspace</span>` : `<span class="tp-workspace-badge-competitor" style="font-size:10px;">\u26A1 Competitor Channel Telemetry</span>`}
            </div>

            <!-- Stats Grid -->
            <div class="tp-grid-2">
              <div class="tp-stat-box">
                <span class="tp-box-label">\u{1F465} Subscribers</span>
                <span class="tp-box-val">${subscribers}</span>
              </div>
              <div class="tp-stat-box">
                <span class="tp-box-label">\u{1F441}\uFE0F Total Views</span>
                <span class="tp-box-val">${totalViews}</span>
              </div>
            </div>

            <!-- Telemetry Cards -->
            <div class="tp-telemetry-row">
              <div class="tp-telemetry-label">
                <span>\u26A1 Views Velocity (VPH)</span>
                <span class="tp-telemetry-sub">Peak: ${peakVph}</span>
              </div>
              <div class="tp-telemetry-val text-emerald">${currentVph} / hr</div>
            </div>

            <div class="tp-telemetry-row">
              <div class="tp-telemetry-label">
                <span>\u{1F4B0} Estimated RPM (${rpmBadge})</span>
                <span class="tp-telemetry-sub">Monthly: ${monthlyRange}</span>
              </div>
              <div class="tp-telemetry-val text-sky">${estRpm}</div>
            </div>

            <div class="tp-telemetry-row">
              <div class="tp-telemetry-label">
                <span>\u{1F3AF} VidIQ Health Score</span>
                <span class="tp-telemetry-sub">Algorithmic Grade</span>
              </div>
              <div class="tp-telemetry-val text-rose">${score}/100</div>
            </div>

            ${isStudio ? `
              <!-- Studio Personal Sync Banner -->
              <div class="tp-studio-sync-card">
                <div class="tp-studio-text">
                  <span class="tp-studio-title">YouTube Studio Detected</span>
                  <span class="tp-studio-sub">Ushbu shaxsiy kanalingizni TubePilot AI bilan tezkor sinxronlang.</span>
                </div>
                <button id="tp-btn-sync-studio" class="tp-btn-sync">
                  \u26A1 Sync with TubePilot AI
                </button>
              </div>
            ` : ""}

            <!-- Direct Actions -->
            <div class="tp-hud-actions">
              <a href="${studioUrl}" target="_blank" class="tp-btn-studio">
                <span>\u{1F680} Open in TubePilot Dashboard</span>
              </a>
            </div>
          </div>
        `}
      </div>
    `;
      const toggleBtn = container.querySelector("#tp-btn-toggle");
      if (toggleBtn) {
        toggleBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          isCollapsed = !isCollapsed;
          injectFloatingHUD(data, channelMeta, isWs);
        });
      }
      const collapsedBar = container.querySelector("#tp-collapsed-bar");
      if (collapsedBar) {
        collapsedBar.addEventListener("click", () => {
          isCollapsed = false;
          injectFloatingHUD(data, channelMeta, isWs);
        });
      }
      const closeBtn = container.querySelector("#tp-btn-close");
      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          container?.remove();
        });
      }
      const syncBtn = container.querySelector("#tp-btn-sync-studio");
      if (syncBtn) {
        syncBtn.addEventListener("click", async () => {
          syncBtn.textContent = "Syncing...";
          try {
            await fetch(`${API_BASE_URL}/api/channels/connect`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title: channelTitle,
                handle: channelHandle,
                subscribers,
                views: totalViews,
                avatar: avatarUrl
              })
            });
            syncBtn.textContent = "\u2705 Synced!";
            setTimeout(() => {
              window.open(studioUrl, "_blank");
            }, 600);
          } catch {
            syncBtn.textContent = "\u274C Sync Failed";
          }
        });
      }
    }
    async function updateHUD() {
      const meta = getActiveChannelIdentifier();
      if (!meta.identifier) return;
      if (currentChannelKey === meta.identifier && document.getElementById(HUD_CONTAINER_ID)) {
        return;
      }
      if (isFetching) return;
      isFetching = true;
      currentChannelKey = meta.identifier;
      try {
        if (!workspaceStatus) {
          await fetchWorkspaceStatus();
        }
        const data = await fetchChannelTelemetry(meta.identifier);
        const isWs = isWorkspaceChannel(meta.identifier, data?.channelTitle);
        injectChannelHeaderHUD(data, meta, isWs);
        injectFloatingHUD(data, meta, isWs);
      } catch (err) {
        console.warn("[TubePilot AI Extension] Telemetry sync error:", err);
      } finally {
        isFetching = false;
      }
    }
    function init() {
      fetchWorkspaceStatus().then(() => updateHUD());
      window.addEventListener("yt-navigate-finish", () => setTimeout(updateHUD, 600));
      window.addEventListener("yt-page-data-updated", () => setTimeout(updateHUD, 600));
      window.addEventListener("popstate", () => setTimeout(updateHUD, 600));
      setInterval(() => {
        const meta = getActiveChannelIdentifier();
        if (meta.identifier && (meta.identifier !== currentChannelKey || !document.getElementById(HUD_CONTAINER_ID))) {
          updateHUD();
        }
      }, 2e3);
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  })();
})();
//# sourceMappingURL=content.js.map
