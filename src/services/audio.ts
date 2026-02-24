// 🎵 VAI UMA ARTE AÊ?! - Sistema de Áudio Imersivo
// Experiência sonora completa usando Web Audio API

type SoundType = 
  | 'click' 
  | 'hover' 
  | 'success' 
  | 'error' 
  | 'notification' 
  | 'achievement'
  | 'levelUp'
  | 'coins'
  | 'whoosh'
  | 'pop'
  | 'toggle'
  | 'modal'
  | 'message'
  | 'like'
  | 'unlock'
  | 'typing'
  | 'send'
  | 'ambient';

interface AudioSettings {
  masterVolume: number;
  sfxVolume: number;
  ambientVolume: number;
  enabled: boolean;
  ambientEnabled: boolean;
}

const DEFAULT_SETTINGS: AudioSettings = {
  masterVolume: 0.5,
  sfxVolume: 0.7,
  ambientVolume: 0.3,
  enabled: true,
  ambientEnabled: false,
};

class AudioManager {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private settings: AudioSettings;
  // Removido - usando ambientNodes
  private isAmbientPlaying: boolean = false;
  private initialized: boolean = false;

  constructor() {
    this.settings = this.loadSettings();
  }

  private loadSettings(): AudioSettings {
    try {
      const saved = localStorage.getItem('vuaa_audio_settings');
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.log('Usando configurações de áudio padrão');
    }
    return DEFAULT_SETTINGS;
  }

  saveSettings() {
    try {
      localStorage.setItem('vuaa_audio_settings', JSON.stringify(this.settings));
    } catch (e) {
      console.log('Erro ao salvar configurações de áudio');
    }
  }

  async init() {
    if (this.initialized) return;
    
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Criar nós de ganho (volume)
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = this.settings.masterVolume;

      this.sfxGain = this.audioContext.createGain();
      this.sfxGain.connect(this.masterGain);
      this.sfxGain.gain.value = this.settings.sfxVolume;

      this.ambientGain = this.audioContext.createGain();
      this.ambientGain.connect(this.masterGain);
      this.ambientGain.gain.value = this.settings.ambientVolume;

      this.initialized = true;
      console.log('🎵 Sistema de áudio inicializado!');
    } catch (e) {
      console.log('Áudio não suportado neste navegador');
    }
  }

  private ensureContext() {
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  // === SONS DE INTERFACE ===

  playClick() {
    if (!this.settings.enabled || !this.audioContext || !this.sfxGain) return;
    this.ensureContext();

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.sfxGain);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.08);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.08);
  }

  playHover() {
    if (!this.settings.enabled || !this.audioContext || !this.sfxGain) return;
    this.ensureContext();

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.sfxGain);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1400, this.audioContext.currentTime + 0.03);
    
    gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.05);
  }

  playToggle(on: boolean) {
    if (!this.settings.enabled || !this.audioContext || !this.sfxGain) return;
    this.ensureContext();

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.sfxGain);
    
    osc.type = 'sine';
    
    if (on) {
      osc.frequency.setValueAtTime(400, this.audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.1);
    } else {
      osc.frequency.setValueAtTime(800, this.audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1);
    }
    
    gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.1);
  }

  playPop() {
    if (!this.settings.enabled || !this.audioContext || !this.sfxGain) return;
    this.ensureContext();

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.sfxGain);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.15);
    
    gain.gain.setValueAtTime(0.4, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.15);
  }

  playWhoosh() {
    if (!this.settings.enabled || !this.audioContext || !this.sfxGain) return;
    this.ensureContext();

    // Criar ruído branco filtrado para efeito whoosh
    const bufferSize = this.audioContext.sampleRate * 0.3;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = this.audioContext.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(500, this.audioContext.currentTime);
    filter.frequency.exponentialRampToValueAtTime(2000, this.audioContext.currentTime + 0.15);
    filter.frequency.exponentialRampToValueAtTime(500, this.audioContext.currentTime + 0.3);
    filter.Q.value = 1;
    
    const gain = this.audioContext.createGain();
    gain.gain.setValueAtTime(0, this.audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    
    noise.start();
    noise.stop(this.audioContext.currentTime + 0.3);
  }

  playModal() {
    if (!this.settings.enabled || !this.audioContext || !this.sfxGain) return;
    this.ensureContext();

    // Acorde suave
    const frequencies = [261.63, 329.63, 392.00]; // C4, E4, G4
    
    frequencies.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();
      
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      const startTime = this.audioContext!.currentTime + i * 0.03;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);
      
      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  }

  // === SONS DE FEEDBACK ===

  playSuccess() {
    if (!this.settings.enabled || !this.audioContext || !this.sfxGain) return;
    this.ensureContext();

    // Melodia de sucesso: C5 → E5 → G5
    const notes = [523.25, 659.25, 783.99];
    
    notes.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();
      
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      const startTime = this.audioContext!.currentTime + i * 0.1;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
      
      osc.start(startTime);
      osc.stop(startTime + 0.2);
    });
  }

  playError() {
    if (!this.settings.enabled || !this.audioContext || !this.sfxGain) return;
    this.ensureContext();

    // Tom de erro: duas notas descendentes
    const notes = [400, 300];
    
    notes.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();
      
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      
      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      
      const startTime = this.audioContext!.currentTime + i * 0.15;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
      
      osc.start(startTime);
      osc.stop(startTime + 0.2);
    });
  }

  playNotification() {
    if (!this.settings.enabled || !this.audioContext || !this.sfxGain) return;
    this.ensureContext();

    // Som de notificação: dois tons
    const osc1 = this.audioContext.createOscillator();
    const osc2 = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.sfxGain);
    
    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.value = 880;
    osc2.frequency.value = 1108.73;
    
    gain.gain.setValueAtTime(0, this.audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.02);
    gain.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.1);
    gain.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
    
    osc1.start();
    osc2.start();
    osc1.stop(this.audioContext.currentTime + 0.4);
    osc2.stop(this.audioContext.currentTime + 0.4);
  }

  // === SONS DE GAMIFICAÇÃO ===

  playAchievement() {
    if (!this.settings.enabled || !this.audioContext || !this.sfxGain) return;
    this.ensureContext();

    // Fanfarra de conquista épica
    const melody = [
      { freq: 523.25, time: 0, duration: 0.15 },      // C5
      { freq: 659.25, time: 0.1, duration: 0.15 },    // E5
      { freq: 783.99, time: 0.2, duration: 0.15 },    // G5
      { freq: 1046.50, time: 0.3, duration: 0.4 },    // C6
      { freq: 783.99, time: 0.35, duration: 0.35 },   // G5 (harmonia)
      { freq: 659.25, time: 0.35, duration: 0.35 },   // E5 (harmonia)
    ];
    
    melody.forEach(({ freq, time, duration }) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();
      
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      const startTime = this.audioContext!.currentTime + time;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.25, startTime + 0.02);
      gain.gain.setValueAtTime(0.25, startTime + duration * 0.7);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    });

    // Adicionar brilho (shimmer)
    this.playShimmer();
  }

  private playShimmer() {
    if (!this.audioContext || !this.sfxGain) return;

    for (let i = 0; i < 5; i++) {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(this.sfxGain);
      
      osc.type = 'sine';
      osc.frequency.value = 2000 + Math.random() * 2000;
      
      const startTime = this.audioContext.currentTime + 0.3 + i * 0.05;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.05, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);
      
      osc.start(startTime);
      osc.stop(startTime + 0.15);
    }
  }

  playLevelUp() {
    if (!this.settings.enabled || !this.audioContext || !this.sfxGain) return;
    this.ensureContext();

    // Escala ascendente épica
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    
    notes.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();
      
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      
      osc.type = i < 4 ? 'sine' : 'triangle';
      osc.frequency.value = freq;
      
      const startTime = this.audioContext!.currentTime + i * 0.08;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2 + i * 0.02, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
      
      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });

    // Power chord final
    setTimeout(() => {
      if (!this.audioContext || !this.sfxGain) return;
      
      [1046.50, 1318.51, 1567.98].forEach(freq => {
        const osc = this.audioContext!.createOscillator();
        const gain = this.audioContext!.createGain();
        
        osc.connect(gain);
        gain.connect(this.sfxGain!);
        
        osc.type = 'sine';
        osc.frequency.value = freq;
        
        const startTime = this.audioContext!.currentTime;
        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.8);
        
        osc.start(startTime);
        osc.stop(startTime + 0.8);
      });
    }, 560);
  }

  playCoins() {
    if (!this.settings.enabled || !this.audioContext || !this.sfxGain) return;
    this.ensureContext();

    // Som de moedas caindo
    for (let i = 0; i < 4; i++) {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(this.sfxGain);
      
      osc.type = 'square';
      
      const startTime = this.audioContext.currentTime + i * 0.08;
      const baseFreq = 2000 + Math.random() * 1000;
      
      osc.frequency.setValueAtTime(baseFreq, startTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, startTime + 0.1);
      
      gain.gain.setValueAtTime(0.1, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);
      
      osc.start(startTime);
      osc.stop(startTime + 0.1);
    }
  }

  playUnlock() {
    if (!this.settings.enabled || !this.audioContext || !this.sfxGain) return;
    this.ensureContext();

    // Som de desbloqueio mágico
    const osc1 = this.audioContext.createOscillator();
    const osc2 = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.sfxGain);
    
    osc1.type = 'sine';
    osc2.type = 'sine';
    
    osc1.frequency.setValueAtTime(300, this.audioContext.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.3);
    
    osc2.frequency.setValueAtTime(300, this.audioContext.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(1800, this.audioContext.currentTime + 0.3);
    
    gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
    
    osc1.start();
    osc2.start();
    osc1.stop(this.audioContext.currentTime + 0.4);
    osc2.stop(this.audioContext.currentTime + 0.4);

    this.playShimmer();
  }

  playLike() {
    if (!this.settings.enabled || !this.audioContext || !this.sfxGain) return;
    this.ensureContext();

    // Som de coração/like
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.sfxGain);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(900, this.audioContext.currentTime + 0.08);
    osc.frequency.exponentialRampToValueAtTime(700, this.audioContext.currentTime + 0.15);
    
    gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.2);
  }

  // === SONS DE CHAT/MENSAGENS ===

  playMessage() {
    if (!this.settings.enabled || !this.audioContext || !this.sfxGain) return;
    this.ensureContext();

    // Som de mensagem recebida
    const notes = [880, 1108.73];
    
    notes.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();
      
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      const startTime = this.audioContext!.currentTime + i * 0.08;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);
      
      osc.start(startTime);
      osc.stop(startTime + 0.15);
    });
  }

  playSend() {
    if (!this.settings.enabled || !this.audioContext || !this.sfxGain) return;
    this.ensureContext();

    // Som de mensagem enviada (whoosh curto)
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.sfxGain);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.12);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.12);
  }

  playTyping() {
    if (!this.settings.enabled || !this.audioContext || !this.sfxGain) return;
    this.ensureContext();

    // Som de tecla (muito sutil)
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.sfxGain);
    
    osc.type = 'square';
    osc.frequency.value = 1000 + Math.random() * 500;
    
    gain.gain.setValueAtTime(0.03, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.03);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.03);
  }

  // === MÚSICA AMBIENTE IMERSIVA ===

  private ambientNodes: {
    oscillators: OscillatorNode[];
    gains: GainNode[];
    filters: BiquadFilterNode[];
    lfo: OscillatorNode | null;
    reverb: ConvolverNode | null;
  } = {
    oscillators: [],
    gains: [],
    filters: [],
    lfo: null,
    reverb: null,
  };

  private musicVolume: number = 0.3;
  private chordIndex: number = 0;
  private chordChangeInterval: ReturnType<typeof setInterval> | null = null;
  private textureInterval: ReturnType<typeof setInterval> | null = null;

  // Progressão de acordes relaxantes (tons menores e maiores com 7ª)
  private readonly chordProgressions = [
    [130.81, 164.81, 196.00, 246.94], // Cmaj7
    [146.83, 174.61, 220.00, 261.63], // Dm7
    [164.81, 196.00, 246.94, 311.13], // Em7
    [174.61, 220.00, 261.63, 329.63], // Fmaj7
    [196.00, 246.94, 293.66, 369.99], // G7
    [220.00, 261.63, 329.63, 415.30], // Am7
    [130.81, 164.81, 196.00, 246.94], // Cmaj7 (volta)
    [116.54, 146.83, 174.61, 220.00], // Bbmaj7
  ];

  // Cria reverb sintético para ambiente espacial
  private async createReverb(): Promise<ConvolverNode | null> {
    if (!this.audioContext) return null;

    const length = this.audioContext.sampleRate * 3; // 3 segundos
    const impulse = this.audioContext.createBuffer(2, length, this.audioContext.sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        // Decay exponencial com difusão
        const decay = Math.exp(-i / (length * 0.3));
        channelData[i] = (Math.random() * 2 - 1) * decay;
      }
    }

    const reverb = this.audioContext.createConvolver();
    reverb.buffer = impulse;
    return reverb;
  }

  startAmbient() {
    if (!this.audioContext || !this.ambientGain || this.isAmbientPlaying) return;
    this.ensureContext();

    this.isAmbientPlaying = true;
    this.settings.ambientEnabled = true;

    // Criar reverb
    this.createReverb().then(reverb => {
      if (!this.audioContext || !this.ambientGain) return;
      
      this.ambientNodes.reverb = reverb;
      
      // Criar mixer para dry/wet
      const reverbGain = this.audioContext.createGain();
      reverbGain.gain.value = 0.4;
      
      if (reverb) {
        reverb.connect(reverbGain);
        reverbGain.connect(this.ambientGain);
      }

      // === DRONE DE FUNDO SUAVE ===
      this.createDrone();

      // === PADS HARMÔNICOS ===
      this.createHarmonicPads();

      // === TEXTURAS SONORAS ===
      this.createTextures();

      // === LFO PARA MOVIMENTO ===
      this.createLFO();

      // === MUDANÇA DE ACORDES ===
      this.startChordProgression();

      // === PARTÍCULAS SONORAS ALEATÓRIAS ===
      this.startSoundParticles();
    });
  }

  private createDrone() {
    if (!this.audioContext || !this.ambientGain) return;

    // Drone principal em C2 (65.41 Hz)
    const droneFreq = 65.41;
    
    // Oscilador principal
    const osc1 = this.audioContext.createOscillator();
    const gain1 = this.audioContext.createGain();
    const filter1 = this.audioContext.createBiquadFilter();
    
    osc1.type = 'sine';
    osc1.frequency.value = droneFreq;
    
    filter1.type = 'lowpass';
    filter1.frequency.value = 200;
    filter1.Q.value = 0.5;
    
    gain1.gain.value = 0;
    
    osc1.connect(filter1);
    filter1.connect(gain1);
    gain1.connect(this.ambientGain);
    
    // Fade in suave
    gain1.gain.linearRampToValueAtTime(0.08, this.audioContext.currentTime + 4);
    
    osc1.start();
    this.ambientNodes.oscillators.push(osc1);
    this.ambientNodes.gains.push(gain1);
    this.ambientNodes.filters.push(filter1);

    // Sub-harmônico uma oitava abaixo
    const osc2 = this.audioContext.createOscillator();
    const gain2 = this.audioContext.createGain();
    
    osc2.type = 'sine';
    osc2.frequency.value = droneFreq / 2;
    
    gain2.gain.value = 0;
    gain2.gain.linearRampToValueAtTime(0.04, this.audioContext.currentTime + 5);
    
    osc2.connect(gain2);
    gain2.connect(this.ambientGain);
    
    osc2.start();
    this.ambientNodes.oscillators.push(osc2);
    this.ambientNodes.gains.push(gain2);
  }

  private createHarmonicPads() {
    if (!this.audioContext || !this.ambientGain) return;

    const chord = this.chordProgressions[this.chordIndex];
    
    chord.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();
      const filter = this.audioContext!.createBiquadFilter();
      
      // Usar tipos de onda diferentes para cada nota
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.value = freq;
      
      // Detune sutil para criar "espessura"
      osc.detune.value = (Math.random() - 0.5) * 10;
      
      filter.type = 'lowpass';
      filter.frequency.value = 600 + i * 100;
      filter.Q.value = 0.7;
      
      gain.gain.value = 0;
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambientGain!);
      
      // Fade in escalonado
      gain.gain.linearRampToValueAtTime(0.03, this.audioContext!.currentTime + 2 + i * 0.5);
      
      osc.start();
      this.ambientNodes.oscillators.push(osc);
      this.ambientNodes.gains.push(gain);
      this.ambientNodes.filters.push(filter);
    });
  }

  private createTextures() {
    if (!this.audioContext || !this.ambientGain) return;

    // Criar "shimmer" de fundo com noise filtrado
    const bufferSize = this.audioContext.sampleRate * 2;
    const noiseBuffer = this.audioContext.createBuffer(2, bufferSize, this.audioContext.sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const data = noiseBuffer.getChannelData(channel);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    }

    const noise = this.audioContext.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    
    const noiseFilter = this.audioContext.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 2000;
    noiseFilter.Q.value = 5;
    
    const noiseGain = this.audioContext.createGain();
    noiseGain.gain.value = 0;
    noiseGain.gain.linearRampToValueAtTime(0.008, this.audioContext.currentTime + 6);
    
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ambientGain);
    
    noise.start();
    this.ambientNodes.oscillators.push(noise as unknown as OscillatorNode);
    this.ambientNodes.gains.push(noiseGain);
    this.ambientNodes.filters.push(noiseFilter);
  }

  private createLFO() {
    if (!this.audioContext) return;

    // LFO para modular filtros (respiração do som)
    const lfo = this.audioContext.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.05; // Muito lento (1 ciclo a cada 20 segundos)
    
    const lfoGain = this.audioContext.createGain();
    lfoGain.gain.value = 200;
    
    lfo.connect(lfoGain);
    
    // Conectar LFO aos filtros
    this.ambientNodes.filters.forEach(filter => {
      lfoGain.connect(filter.frequency);
    });
    
    lfo.start();
    this.ambientNodes.lfo = lfo;
  }

  private startChordProgression() {
    // Mudar acordes a cada 15-20 segundos
    this.chordChangeInterval = setInterval(() => {
      if (!this.isAmbientPlaying || !this.audioContext) return;
      
      this.chordIndex = (this.chordIndex + 1) % this.chordProgressions.length;
      const newChord = this.chordProgressions[this.chordIndex];
      
      // Transição suave para novas frequências
      this.ambientNodes.oscillators.slice(2, 6).forEach((osc, i) => {
        if (newChord[i] && osc.frequency) {
          const currentTime = this.audioContext!.currentTime;
          osc.frequency.linearRampToValueAtTime(newChord[i], currentTime + 4);
        }
      });
    }, 15000 + Math.random() * 5000);
  }

  private startSoundParticles() {
    // Partículas sonoras aleatórias (sinos, brilhos)
    this.textureInterval = setInterval(() => {
      if (!this.isAmbientPlaying || !this.audioContext || !this.ambientGain) return;
      
      // Chance de 30% de tocar uma partícula
      if (Math.random() > 0.3) return;
      
      const particleType = Math.random();
      
      if (particleType < 0.5) {
        // Sino cristalino
        this.playBellParticle();
      } else {
        // Brilho ascendente
        this.playShimmerParticle();
      }
    }, 3000);
  }

  private playBellParticle() {
    if (!this.audioContext || !this.ambientGain) return;

    const freq = [523.25, 659.25, 783.99, 1046.50][Math.floor(Math.random() * 4)];
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = 'sine';
    osc.frequency.value = freq;
    
    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(0.03, this.audioContext.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 2);
    
    osc.connect(gain);
    gain.connect(this.ambientGain);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 2);
  }

  private playShimmerParticle() {
    if (!this.audioContext || !this.ambientGain) return;

    const baseFreq = 1000 + Math.random() * 1000;
    
    for (let i = 0; i < 3; i++) {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = baseFreq + i * 200;
      
      const startTime = this.audioContext.currentTime + i * 0.1;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.015, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1);
      
      osc.connect(gain);
      gain.connect(this.ambientGain);
      
      osc.start(startTime);
      osc.stop(startTime + 1);
    }
  }

  stopAmbient() {
    this.isAmbientPlaying = false;
    this.settings.ambientEnabled = false;

    // Limpar intervalos
    if (this.chordChangeInterval) {
      clearInterval(this.chordChangeInterval);
      this.chordChangeInterval = null;
    }
    if (this.textureInterval) {
      clearInterval(this.textureInterval);
      this.textureInterval = null;
    }

    // Fade out suave de todos os nodes
    this.ambientNodes.gains.forEach(gain => {
      if (gain && this.audioContext) {
        gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 2);
      }
    });

    // Parar osciladores após fade out
    setTimeout(() => {
      this.ambientNodes.oscillators.forEach(osc => {
        try {
          osc.stop();
        } catch {
          // Já parado
        }
      });

      if (this.ambientNodes.lfo) {
        try {
          this.ambientNodes.lfo.stop();
        } catch {
          // Já parado
        }
      }

      // Resetar arrays
      this.ambientNodes = {
        oscillators: [],
        gains: [],
        filters: [],
        lfo: null,
        reverb: null,
      };
    }, 2500);
  }

  toggleAmbient() {
    if (this.isAmbientPlaying) {
      this.stopAmbient();
    } else {
      this.startAmbient();
    }
    this.saveSettings();
    return this.isAmbientPlaying;
  }

  setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.ambientGain) {
      this.ambientGain.gain.linearRampToValueAtTime(
        volume * 0.3, 
        this.audioContext?.currentTime || 0 + 0.1
      );
    }
    this.settings.ambientVolume = volume;
    this.saveSettings();
  }

  getMusicVolume(): number {
    return this.musicVolume;
  }

  isAmbientMusicPlaying(): boolean {
    return this.isAmbientPlaying;
  }

  // === CONFIGURAÇÕES ===

  setMasterVolume(volume: number) {
    this.settings.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGain) {
      this.masterGain.gain.value = this.settings.masterVolume;
    }
    this.saveSettings();
  }

  setSfxVolume(volume: number) {
    this.settings.sfxVolume = Math.max(0, Math.min(1, volume));
    if (this.sfxGain) {
      this.sfxGain.gain.value = this.settings.sfxVolume;
    }
    this.saveSettings();
  }

  setAmbientVolume(volume: number) {
    this.settings.ambientVolume = Math.max(0, Math.min(1, volume));
    if (this.ambientGain) {
      this.ambientGain.gain.value = this.settings.ambientVolume;
    }
    this.saveSettings();
  }

  toggleSound() {
    this.settings.enabled = !this.settings.enabled;
    this.saveSettings();
    return this.settings.enabled;
  }

  getSettings(): AudioSettings {
    return { ...this.settings };
  }

  // === MÉTODO GENÉRICO ===

  play(sound: SoundType) {
    switch (sound) {
      case 'click': this.playClick(); break;
      case 'hover': this.playHover(); break;
      case 'success': this.playSuccess(); break;
      case 'error': this.playError(); break;
      case 'notification': this.playNotification(); break;
      case 'achievement': this.playAchievement(); break;
      case 'levelUp': this.playLevelUp(); break;
      case 'coins': this.playCoins(); break;
      case 'whoosh': this.playWhoosh(); break;
      case 'pop': this.playPop(); break;
      case 'toggle': this.playToggle(true); break;
      case 'modal': this.playModal(); break;
      case 'message': this.playMessage(); break;
      case 'like': this.playLike(); break;
      case 'unlock': this.playUnlock(); break;
      case 'typing': this.playTyping(); break;
      case 'send': this.playSend(); break;
      case 'ambient': this.startAmbient(); break;
    }
  }
}

// Singleton
export const audioManager = new AudioManager();
export type { AudioSettings, SoundType };
