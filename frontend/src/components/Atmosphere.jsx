// Kiss Land atmospheric layer — CRT scanlines, film grain, vignette.
// Fixed, pointer-events-none overlays shared across screens.
export default function Atmosphere({ vignette = true }) {
    return (
        <>
            <div className="bd-scanlines" />
            <div className="bd-grain" />
            {vignette && <div className="bd-vignette" />}
        </>
    );
}
