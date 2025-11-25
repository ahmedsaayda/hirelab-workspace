import { useState } from "react";
import UserService from "../../services/UserService";

export default function MetaMvpDemo() {
  const [adImage, setAdImage] = useState("https://hirelab.io/wp-content/uploads/2024/06/HireLab-Logo-Purple-2025.png");
  const [adHeadline, setAdHeadline] = useState("HireLab - The Future of Hiring(test)");
  const [adBudget, setAdBudget] = useState(1);
  const [landingPageId, setLandingPageId] = useState("6901761b563848ce0d3b21c6");
  const [destinationUrl, setDestinationUrl] = useState("https://hirelab.io/lp/6901761b563848ce0d3b21c6");
  const [cta, setCta] = useState("APPLY_NOW");
  const [adJobCity, setAdJobCity] = useState("");
  const [adJobInterest, setAdJobInterest] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    const hasLpId = !!landingPageId?.trim();
    const hasDest = !!destinationUrl?.trim();
    if (!hasLpId && !hasDest) {
      setLoading(false);
      setError({ message: "Provide either a Landing Page ID or a public Destination URL." });
      return;
    }
    try {
      const payload = {
        adImage,
        adHeadline,
        cta,
        adJobCity: adJobCity || undefined,
        adJobInterest: adJobInterest || undefined,
        adBudget: Number(adBudget) || 25,
        promote: hasLpId ? { _id: landingPageId } : undefined,
        destinationUrl: hasDest ? destinationUrl : undefined,
      };
      const resp = await UserService.postAd(payload);
      // Legacy flow: backend returns { url: oauthUri } if no/expired token
      if (resp?.data?.url) {
        window.location.href = resp.data.url;
        return;
      }
      setResult(resp.data);
    } catch (err) {
      setError(err?.response?.data || { message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 20 }}>
      <h2>Meta MVP Demo (Legacy userController flow)</h2>
      <p style={{ color: "#555", marginBottom: 16 }}>
        This page calls the legacy <code>/user/postAd</code> endpoint. If your Meta token is missing or expired, you
        will be redirected to the Meta OAuth popup. After connecting, return here and submit again.
      </p>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          Ad Image URL
          <input
            type="text"
            placeholder="https://... (must be publicly accessible)"
            value={adImage}
            onChange={(e) => setAdImage(e.target.value)}
            style={{ width: "100%", padding: 8 }}
            required
          />
        </label>
        <label>
          Headline
          <input
            type="text"
            placeholder="Your ad headline"
            value={adHeadline}
            onChange={(e) => setAdHeadline(e.target.value)}
            style={{ width: "100%", padding: 8 }}
            required
          />
        </label>
        <label>
          Budget (USD)
          <input
            type="number"
            min={1}
            step={1}
            value={adBudget}
            onChange={(e) => setAdBudget(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </label>
        <label>
          Landing Page ID (for default link)
          <input
            type="text"
            placeholder="LandingPage _id (optional if Destination URL is provided)"
            value={landingPageId}
            onChange={(e) => setLandingPageId(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </label>
        <label>
          Destination URL (public https)
          <input
            type="text"
            placeholder="https://your-public-url.example.com"
            value={destinationUrl}
            onChange={(e) => setDestinationUrl(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </label>
        <label>
          CTA
          <input
            type="text"
            placeholder="APPLY_NOW"
            value={cta}
            onChange={(e) => setCta(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label>
            Job City (optional)
            <input
              type="text"
              placeholder="City"
              value={adJobCity}
              onChange={(e) => setAdJobCity(e.target.value)}
              style={{ width: "100%", padding: 8 }}
            />
          </label>
          <label>
            Job Interest ID (optional)
            <input
              type="text"
              placeholder="Interest ID"
              value={adJobInterest}
              onChange={(e) => setAdJobInterest(e.target.value)}
              style={{ width: "100%", padding: 8 }}
            />
          </label>
        </div>
        <button type="submit" disabled={loading} style={{ padding: "10px 16px" }}>
          {loading ? "Publishing..." : "Publish via Legacy MVP"}
        </button>
      </form>

      {result ? (
        <div style={{ marginTop: 24 }}>
          <h3>Result</h3>
          <pre style={{ background: "#f5f5f5", padding: 12, overflow: "auto" }}>
{JSON.stringify(result, null, 2)}
          </pre>
        </div>
      ) : null}
      {error ? (
        <div style={{ marginTop: 24 }}>
          <h3 style={{ color: "#b00" }}>Error</h3>
          <pre style={{ background: "#fff0f0", padding: 12, overflow: "auto", border: "1px solid #f5c2c2" }}>
{JSON.stringify(error, null, 2)}
          </pre>
        </div>
      ) : null}
    </div>
  );
}


