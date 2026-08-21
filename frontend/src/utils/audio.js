/**
 * Synthesizes a distinctive high-tech dual-pulse emergency chime
 */
export const playAlertChime = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // High Tone Beep 1
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(987.77, audioCtx.currentTime); // B5
    osc1.frequency.exponentialRampToValueAtTime(1318.51, audioCtx.currentTime + 0.12); // E6

    gain1.gain.setValueAtTime(0.35, audioCtx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.14);

    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);

    osc1.start(audioCtx.currentTime);
    osc1.stop(audioCtx.currentTime + 0.15);

    // High Tone Beep 2
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1318.51, audioCtx.currentTime + 0.16); // E6
    osc2.frequency.exponentialRampToValueAtTime(1760.00, audioCtx.currentTime + 0.35); // A6

    gain2.gain.setValueAtTime(0.4, audioCtx.currentTime + 0.16);
    gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.38);

    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);

    osc2.start(audioCtx.currentTime + 0.16);
    osc2.stop(audioCtx.currentTime + 0.4);
  } catch (e) {
    console.warn('Audio chime play blocked', e);
  }
};
