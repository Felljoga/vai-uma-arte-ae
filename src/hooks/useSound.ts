import { useCallback, useRef, useState, useEffect } from 'react';

// Tipo para contexto de áudio
type AudioContextType = AudioContext | null;

export const useSound = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioContextRef = useRef<AudioContextType>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const ambientOscillatorRef = useRef<OscillatorNode | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);

  // Inicializa o contexto de áudio
  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.gain.value = volume;
      gainNodeRef.current.connect(audioContextRef.current.destination);
    }
    return audioContextRef.current;
  }, [volume]);

  // Som de pop digital
  const playPop = useCallback(() => {
    if (!isEnabled) return;
    const ctx = initAudio();
    if (!ctx || !gainNodeRef.current) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.15 * volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    
    osc.connect(gain);
    gain.connect(gainNodeRef.current);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  }, [isEnabled, volume, initAudio]);

  // Som de whoosh suave
  const playWhoosh = useCallback(() => {
    if (!isEnabled) return;
    const ctx = initAudio();
    if (!ctx || !gainNodeRef.current) return;

    const noise = ctx.createBufferSource();
    const bufferSize = ctx.sampleRate * 0.3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    
    noise.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.15);
    filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
    filter.Q.value = 1;
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.1 * volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(gainNodeRef.current);
    noise.start();
  }, [isEnabled, volume, initAudio]);

  // Som de click metálico
  const playClick = useCallback(() => {
    if (!isEnabled) return;
    const ctx = initAudio();
    if (!ctx || !gainNodeRef.current) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(2000, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.03);
    
    gain.gain.setValueAtTime(0.12 * volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    
    osc.connect(gain);
    gain.connect(gainNodeRef.current);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }, [isEnabled, volume, initAudio]);

  // Som de glitch artístico
  const playGlitch = useCallback(() => {
    if (!isEnabled) return;
    const ctx = initAudio();
    if (!ctx || !gainNodeRef.current) return;

    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'square';
        osc.frequency.value = 100 + Math.random() * 300;
        
        gain.gain.setValueAtTime(0.05 * volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.02);
        
        osc.connect(gain);
        gain.connect(gainNodeRef.current!);
        osc.start();
        osc.stop(ctx.currentTime + 0.02);
      }, i * 30);
    }
  }, [isEnabled, volume, initAudio]);

  // Som de hover
  const playHover = useCallback(() => {
    if (!isEnabled) return;
    const ctx = initAudio();
    if (!ctx || !gainNodeRef.current) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0.05 * volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    
    osc.connect(gain);
    gain.connect(gainNodeRef.current);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  }, [isEnabled, volume, initAudio]);

  // Trilha ambiente
  const startAmbient = useCallback(() => {
    if (!isEnabled) return;
    const ctx = initAudio();
    if (!ctx || !gainNodeRef.current || ambientOscillatorRef.current) return;

    ambientGainRef.current = ctx.createGain();
    ambientGainRef.current.gain.value = 0;

    // Drone base
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 60;
    
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 90;

    const osc3 = ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.value = 120;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 200;

    osc1.connect(ambientGainRef.current);
    osc2.connect(ambientGainRef.current);
    osc3.connect(ambientGainRef.current);
    ambientGainRef.current.connect(filter);
    filter.connect(gainNodeRef.current);

    osc1.start();
    osc2.start();
    osc3.start();

    ambientOscillatorRef.current = osc1;

    // Fade in
    ambientGainRef.current.gain.setValueAtTime(0, ctx.currentTime);
    ambientGainRef.current.gain.linearRampToValueAtTime(0.03 * volume, ctx.currentTime + 2);
  }, [isEnabled, volume, initAudio]);

  const stopAmbient = useCallback(() => {
    if (ambientOscillatorRef.current && ambientGainRef.current && audioContextRef.current) {
      ambientGainRef.current.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 0.5);
      setTimeout(() => {
        try {
          ambientOscillatorRef.current?.stop();
        } catch {}
        ambientOscillatorRef.current = null;
      }, 600);
    }
  }, []);

  // Toggle som
  const toggleSound = useCallback(() => {
    setIsEnabled(prev => {
      if (!prev) {
        initAudio();
        return true;
      }
      stopAmbient();
      return false;
    });
  }, [initAudio, stopAmbient]);

  // Efeito para iniciar ambient quando habilitado
  useEffect(() => {
    if (isEnabled) {
      startAmbient();
    }
    return () => {
      stopAmbient();
    };
  }, [isEnabled, startAmbient, stopAmbient]);

  // Atualiza volume
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);

  return {
    isEnabled,
    volume,
    setVolume,
    toggleSound,
    playPop,
    playWhoosh,
    playClick,
    playGlitch,
    playHover,
  };
};
