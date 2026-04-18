/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Mic, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  Users, 
  MessageSquare, 
  Award, 
  ShoppingBag,
  Info,
  ArrowRight,
  ShieldCheck,
  Zap,
  Droplets,
  Gift,
  Heart,
  Droplet
} from 'lucide-react';
import { Blogger, Step, DebateRound, Recommendation } from './types';
import { BLOGGERS, KNOWLEDGE_BASE } from './constants';

// --- Components ---

const GlassCard = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={`glass-morphism rounded-[var(--border-radius)] shadow-[var(--duo-shadow)] border-2 border-white ${className}`}>
    {children}
  </div>
);

const SunflowerTag = ({ text }: { text: string }) => (
  <span className="px-3 py-1 bg-[var(--accent-yellow)] text-black text-[11px] font-black rounded-full uppercase tracking-tighter border-b-2 border-black/10">
    {text}
  </span>
);

export default function App() {
  const [step, setStep] = useState<Step>('input');
  const [input, setInput] = useState('');
  const [focusOption, setFocusOption] = useState<'A' | 'B' | 'C' | null>(null);
  const [selectedBloggerIds, setSelectedBloggerIds] = useState<string[]>([]);
  const [isDebating, setIsDebating] = useState(false);
  const [debateRounds, setDebateRounds] = useState<DebateRound[]>([]);
  const [currentRound, setCurrentRound] = useState(0);

  // --- Derived Data ---
  const matchedBloggers = BLOGGERS.slice(0, 5); // Simplification for demo
  const selectedBloggers = BLOGGERS.filter(b => selectedBloggerIds.includes(b.id));

  // --- Handlers ---
  const startToKnowledge = () => {
    if (!input.trim()) return;
    setStep('knowledge');
  };

  const handleFocus = (option: 'A' | 'B' | 'C') => {
    setFocusOption(option);
    setStep('matching');
  };

  const toggleBloggerSelection = (id: string) => {
    setSelectedBloggerIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length < 3) return [...prev, id];
      return prev;
    });
  };

  const startDebate = () => {
    setStep('debate');
    setIsDebating(true);
    // Simulate debate rounds
    const mockRounds: DebateRound[] = [
      { round: 1, speaker: selectedBloggers[0].name, content: "针对您的油痘肌，我是不是先问一下：您是全脸油还是T区油？平时有用过酸类产品吗？" },
      { round: 1, speaker: selectedBloggers[1].name, content: "我也想追问下，您的爆痘是偶尔几个还是大面积？预算是否真的必须控制在200以内？" },
      { round: 1, speaker: selectedBloggers[2].name, content: "补充一个，皮肤平时会容易泛红发烫吗？这决定了我们能不能上猛药。" },
      { round: 2, speaker: selectedBloggers[0].name, content: "我觉得既然预算优先，国货的性价比最高，温和水杨酸是首选。" },
      { round: 2, speaker: selectedBloggers[1].name, content: "反驳！低浓度水杨酸见效太慢，既然是爆痘期，还是应该选择更有针对性的包裹型点涂产品。" },
      { round: 3, speaker: selectedBloggers[2].name, content: "两位等一下，用户提到了皮肤有点敏感。盲目上酸会烂脸的，我建议先修护屏障。" },
      { round: 4, speaker: selectedBloggers[0].name, content: "超预算预警：如果又要成分好又要温和，某些进口品牌可能会超出200元的范围哦。" },
      { round: 5, speaker: selectedBloggers[0].name, content: "最终总结：我推荐博乐达水杨酸，温和控油且量大实用。" },
      { round: 5, speaker: selectedBloggers[1].name, content: "我最终推荐理肤泉K乳，经典之选，对闭口有奇效。" },
      { round: 5, speaker: selectedBloggers[2].name, content: "为了维稳，我站至本多元修护，不到百元真心好用。" },
    ];
    setDebateRounds(mockRounds);
  };

  useEffect(() => {
    if (step === 'debate' && isDebating) {
      const timer = setInterval(() => {
        setCurrentRound(prev => {
          if (prev >= debateRounds.length - 1) {
            clearInterval(timer);
            setIsDebating(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
      return () => clearInterval(timer);
    }
  }, [step, isDebating, debateRounds]);

  const goToResult = () => {
    setStep('result');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-main)] font-sans p-6 md:p-12 overflow-x-hidden">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <header className="flex items-center justify-between pb-4 border-b-4 border-black/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF9A9E] to-[#FAD0C4] rounded-2xl flex items-center justify-center shadow-md rotate-3">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-[var(--text-main)]">BEAUTY <span className="text-[#FF8E9E]">AI</span></h1>
          </div>
          <div className="hidden md:flex items-center gap-6 text-[14px] font-bold">
            <span className="text-[var(--text-secondary)] hover:text-black transition-colors cursor-pointer">发现</span>
            <span className="text-[var(--text-secondary)] hover:text-black transition-colors cursor-pointer">实验室</span>
            <div className="px-4 py-1.5 bg-[var(--accent-yellow)] text-black rounded-full text-[11px] font-black duo-button">
              BETA LIVE
            </div>
          </div>
        </header>

        <main className="relative">
          <AnimatePresence mode="wait">
            
            {/* Step 1: Input */}
            {step === 'input' && (
              <motion.div 
                key="input"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="space-y-12 py-16"
              >
                <div className="text-center space-y-6">
                  <div className="inline-block px-4 py-1 bg-white rounded-full text-xs font-black text-[#FF8E9E] border-2 border-[#FFC1CC] shadow-sm mb-2">
                    ✨ AI 选品新方式
                  </div>
                  <h2 className="text-5xl md:text-6xl font-black tracking-tight text-[var(--text-main)]">
                    有问题？<br />陪你 <span className="text-[#58CC02] border-b-4 border-[#58CC02]/20">辩论</span> 到底
                  </h2>
                  <p className="text-lg text-[var(--text-secondary)] font-bold max-w-md mx-auto">
                    不管是平替还是贵妇，不管是成分还是包装，<br />
                    在这里，我们只说真话。
                  </p>
                </div>

                <div className="max-w-xl mx-auto space-y-8">
                  <div className="relative group">
                    <div className="absolute -inset-2 bg-gradient-to-r from-[#FF9A9E] to-[#FEB692] rounded-[36px] blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                    <GlassCard className="relative p-3 flex items-center gap-4 bg-white/80 border-b-4 border-black/10">
                      <Search className="ml-5 text-[#FFB6C1] w-6 h-6" />
                      <input 
                        type="text" 
                        placeholder="今年夏天最火的防晒，真的好用吗？"
                        className="flex-1 bg-transparent py-5 text-lg font-bold outline-none placeholder:text-gray-300"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && startToKnowledge()}
                      />
                      <button 
                        className="w-14 h-14 bg-[#FF8E9E] rounded-full flex items-center justify-center duo-button active:translate-y-1" 
                        onClick={startToKnowledge}
                      >
                        <ArrowRight className="text-white w-6 h-6" />
                      </button>
                    </GlassCard>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-3">
                    {['200元平替', '油痘肌必看', '敏肌救星', '早C晚A'].map(tag => (
                      <button 
                        key={tag}
                        onClick={() => setInput(tag)}
                        className="px-5 py-2.5 bg-white rounded-2xl text-[14px] font-black text-[var(--text-secondary)] border-b-4 border-black/5 hover:border-black/10 hover:bg-gray-50 transition-all active:translate-y-0.5"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Knowledge */}
            {step === 'knowledge' && (
              <motion.div 
                key="knowledge"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-6"
              >
                <div className="md:col-span-8 flex flex-col gap-6">
                  <GlassCard className="p-10 space-y-6 flex-1 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full w-fit">
                      <Droplets className="w-3.5 h-3.5" />
                      <span className="font-bold uppercase tracking-wider text-[10px]">肤质底层逻辑</span>
                    </div>
                    <h3 className="text-4xl font-bold tracking-tight">{KNOWLEDGE_BASE.acne.title}</h3>
                    <p className="text-[19px] text-[var(--text-secondary)] leading-relaxed font-medium">
                      {KNOWLEDGE_BASE.acne.content}
                    </p>
                  </GlassCard>
                  <GlassCard className="p-8 bg-[var(--accent-yellow)] flex items-start gap-5 border-none shadow-yellow-200">
                    <div className="p-4 bg-white/20 backdrop-blur rounded-2xl">
                      <Zap className="text-black w-7 h-7" />
                    </div>
                    <div className="space-y-1 pt-1">
                      <div className="text-[11px] font-black uppercase tracking-widest text-black/40">误区提醒</div>
                      <p className="text-lg font-bold text-black/90 leading-tight">
                        {KNOWLEDGE_BASE.acne.misconception}
                      </p>
                    </div>
                  </GlassCard>
                </div>
                
                <div className="md:col-span-4 flex flex-col gap-6">
                  <div className="px-1 py-1">
                    <h4 className="text-sm font-black uppercase tracking-widest text-[var(--text-secondary)] flex items-center gap-2">
                       <ArrowRight className="w-3.5 h-3.5" /> 二次聚焦筛选
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { id: 'A', title: '预算优先', sub: '200元内，性价比最大化', color: 'bg-emerald-500' },
                      { id: 'B', title: '效果优先', sub: '成分硬核，快速见效', color: 'bg-orange-500' },
                      { id: 'C', title: '温和修护', sub: '屏障修复，温和无刺激', color: 'bg-indigo-500' }
                    ].map((opt) => (
                      <button 
                        key={opt.id} 
                        onClick={() => handleFocus(opt.id as any)} 
                        className="group text-left active:scale-[0.98] transition-transform"
                      >
                        <GlassCard className="p-7 hover:border-[var(--accent-yellow)] transition-all relative overflow-hidden">
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${opt.color} opacity-20`} />
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 group-hover:text-black transition-colors">Option {opt.id}</span>
                            <div className={`w-2 h-2 rounded-full ${opt.color}`} />
                          </div>
                          <div className="font-bold text-xl mb-1">{opt.title}</div>
                          <div className="text-[13px] text-[var(--text-secondary)] font-medium">{opt.sub}</div>
                        </GlassCard>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Blogger Selection */}
            {step === 'matching' && (
              <motion.div 
                key="matching"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10"
              >
                <div className="flex items-center justify-between px-2">
                  <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight">为您精准匹配博主</h2>
                    <p className="text-[15px] text-[var(--text-secondary)] font-medium">请自主挑选 3 位进入后续辩论环节</p>
                  </div>
                  <div className="h-10 px-4 bg-white/60 border border-white/80 rounded-full flex items-center gap-2 shadow-sm">
                    <Users className="w-4 h-4 text-black/40" />
                    <span className="text-[13px] font-black uppercase tracking-tighter">已选 {selectedBloggerIds.length} / 3</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {matchedBloggers.map(blogger => (
                    <div 
                      key={blogger.id}
                      onClick={() => toggleBloggerSelection(blogger.id)}
                      className="cursor-pointer transition-all duration-300 relative group active:scale-[0.97]"
                    >
                      <GlassCard className={`h-full flex flex-col items-center text-center p-7 relative transition-all duration-500 overflow-hidden
                        ${selectedBloggerIds.includes(blogger.id) ? 'border-[var(--accent-yellow)] ring-4 ring-[var(--accent-yellow)]/10 scale-[1.02]' : 'hover:border-black/5'}
                      `}>
                        {selectedBloggerIds.includes(blogger.id) && (
                          <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--accent-yellow)] rotate-45 translate-x-14 -translate-y-14 flex items-end justify-center pb-2 pr-10">
                            <CheckCircle2 className="w-3.5 h-3.5 text-black -rotate-45" />
                          </div>
                        )}
                        <img src={blogger.avatar} className="w-20 h-20 rounded-[28px] object-cover shadow-lg mb-5 border-4 border-white" alt={blogger.name} />
                        <div className="space-y-1 self-stretch">
                          <h3 className="font-bold text-lg">{blogger.name}</h3>
                          <div className="text-[10px] font-black text-[var(--accent-yellow)] border border-[var(--accent-yellow)]/20 px-1.5 py-0.5 rounded-md inline-block uppercase tracking-widest">{blogger.type}</div>
                        </div>
                        <p className="text-[11.5px] text-[var(--text-secondary)] font-medium leading-[1.3] my-4 px-2">“{blogger.quote}”</p>
                        <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                          {blogger.tags.slice(0, 2).map(t => (
                            <span key={t} className="px-2 py-0.5 bg-black/5 text-[9px] font-black tracking-widest uppercase rounded-lg text-black/60">{t}</span>
                          ))}
                        </div>
                      </GlassCard>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center pt-6">
                  <button 
                    disabled={selectedBloggerIds.length !== 3}
                    onClick={startDebate}
                    className={`group px-14 py-6 rounded-[32px] font-black text-xl flex items-center gap-3 transition-all relative overflow-hidden active:scale-95
                      ${selectedBloggerIds.length === 3 ? 'bg-[var(--text-main)] text-white shadow-2xl hover:shadow-[var(--accent-yellow)]/30' : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'}
                    `}
                  >
                    开始辩论直播
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[var(--accent-yellow)] group-hover:text-black transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Debate (Livestream Style) */}
            {step === 'debate' && (
              <motion.div 
                key="debate"
                className="relative h-[700px] rounded-[40px] overflow-hidden shadow-2xl border-4 border-white"
              >
                {/* Livestream Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#2D3436] to-[#000000]" />
                
                {/* Hearts Animation Container */}
                <div className="absolute right-8 bottom-32 z-50">
                   <div className="relative">
                      {/* Simulating floating hearts */}
                      <motion.div animate={{ y: -200, opacity: 0 }} transition={{ repeat: Infinity, duration: 2 }} className="text-red-500 absolute bottom-0">❤️</motion.div>
                      <motion.div animate={{ y: -180, x: -20, opacity: 0 }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }} className="text-blue-400 absolute bottom-0">💙</motion.div>
                      <motion.div animate={{ y: -220, x: 20, opacity: 0 }} transition={{ repeat: Infinity, duration: 2, delay: 1 }} className="text-yellow-400 absolute bottom-0">💛</motion.div>
                   </div>
                </div>

                {/* Top Overlay: Blogger Info */}
                <div className="absolute top-0 left-0 right-0 p-6 flex items-start justify-between z-10 bg-gradient-to-b from-black/60 to-transparent">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md p-1.5 pr-4 rounded-full border border-white/20">
                      <img src={selectedBloggers[0]?.avatar} className="w-10 h-10 rounded-full border-2 border-[var(--accent-yellow)]" alt="" />
                      <div>
                        <div className="text-white text-xs font-black">{selectedBloggers[0]?.name}</div>
                        <div className="text-white/60 text-[10px] font-bold flex items-center gap-1">
                          <Users className="w-2.5 h-2.5" /> 12.8w 本场关注
                        </div>
                      </div>
                      <button className="ml-2 px-3 py-1 bg-[#FF8E9E] text-white text-[10px] font-black rounded-full duo-button">关注</button>
                    </div>
                    <div className="flex gap-2">
                       {selectedBloggers.slice(1).map(b => (
                         <div key={b.id} className="w-8 h-8 rounded-full border-2 border-white/40 overflow-hidden">
                           <img src={b.avatar} className="w-full h-full object-cover" alt="" />
                         </div>
                       ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="bg-[#FF0050] text-white px-3 py-1 rounded-md text-[10px] font-black tracking-widest animate-pulse">LIVE 辩论中</div>
                    <div className="bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-white/80 text-[10px] font-bold"> ID: BeautyAI-999</div>
                  </div>
                </div>

                {/* Main Content: The Bubble Feed */}
                <div className="absolute inset-0 pt-32 pb-40 px-6 overflow-y-auto custom-scrollbar flex flex-col justify-end">
                  <div className="space-y-4">
                    {debateRounds.slice(0, currentRound + 1).map((round, idx) => {
                      const blogger = selectedBloggers.find(b => b.name === round.speaker);
                      return (
                        <motion.div 
                          initial={{ opacity: 0, x: -20, scale: 0.9 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          key={idx}
                          className="flex items-start gap-3 max-w-[90%]"
                        >
                          <img src={blogger?.avatar} className="w-8 h-8 rounded-full border-2 border-white flex-shrink-0" alt="" />
                          <div className="bg-black/30 backdrop-blur-lg border border-white/10 p-3 py-2 rounded-2xl rounded-tl-none">
                            <span className="text-[var(--accent-yellow)] text-[11px] font-black mr-2 uppercase">{round.speaker}:</span>
                            <span className="text-white text-[14px] font-bold leading-relaxed">{round.content}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                    <div id="debate-end" />
                  </div>
                </div>

                {/* Bottom Overlay: Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-8 pt-12 flex items-center gap-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex-1 h-12 bg-white/20 backdrop-blur-md rounded-full border border-white/20 flex items-center px-6 text-white/60 text-sm font-bold">
                    说点什么，为喜欢的博主打 Call...
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FFDE59] to-[#FF914D] rounded-full flex items-center justify-center shadow-lg cursor-pointer animate-bounce">
                      <Gift className="text-white w-6 h-6" />
                    </div>
                    <div className="w-12 h-12 bg-[#FF0050] rounded-full flex items-center justify-center shadow-lg cursor-pointer">
                      <Heart className="text-white w-6 h-6 fill-current" />
                    </div>
                  </div>
                </div>

                {!isDebating && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-center p-8"
                  >
                    <div className="w-24 h-24 bg-[var(--accent-yellow)] rounded-full flex items-center justify-center shadow-2xl mb-6 duo-button">
                      <CheckCircle2 className="w-12 h-12 text-black" />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-4">辩论直播圆满结束！</h3>
                    <p className="text-white/60 font-bold mb-10 max-w-xs">三位博主已经为您在海量观点中提炼出了最硬核的推荐结果</p>
                    <button 
                      onClick={goToResult}
                      className="px-10 py-5 bg-[#FF8E9E] text-white rounded-full font-black text-xl duo-button active:scale-95"
                    >
                      点击领取我的专属推荐
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Step 5: Result (Celebration Style) */}
            {step === 'result' && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-10"
              >
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-[#58CC02] rounded-3xl mx-auto flex items-center justify-center shadow-xl duo-button mb-4 border-b-8 border-black/10">
                    <CheckCircle2 className="text-white w-10 h-10" />
                  </div>
                  <h2 className="text-4xl font-black tracking-tight">为您挑到宝啦！</h2>
                  <p className="text-lg text-[var(--text-secondary)] font-bold">综合博主实测与辩论共识，该选品最值得入手</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  <GlassCard className="md:col-span-12 p-10 bg-gradient-to-br from-white to-[#FFF5F7] border-none">
                     <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="w-72 h-72 bg-gradient-to-tr from-[#FF9A9E] to-[#FAD0C4] rounded-[48px] flex items-center justify-center shadow-inner relative group border-4 border-white">
                           <ShoppingBag className="w-24 h-24 text-white/40 transition-transform group-hover:scale-110" />
                           <img src="https://picsum.photos/seed/beauty/500/500" className="absolute inset-0 w-full h-full object-cover rounded-[48px] mix-blend-overlay opacity-50" alt="" />
                        </div>
                        <div className="flex-1 space-y-8">
                           <div className="space-y-2">
                             <div className="flex gap-2">
                                <SunflowerTag text="博乐达" />
                                <SunflowerTag text="官方授权" />
                             </div>
                             <h3 className="text-5xl font-black tracking-tighter">超分子水杨酸面膜</h3>
                             <p className="text-2xl font-black text-[#FF8E9E]">¥128 <span className="text-sm font-bold opacity-60">官方直播价</span></p>
                           </div>

                           <div className="p-6 bg-[#58CC02]/10 rounded-3xl border-2 border-[#58CC02]/20">
                             <div className="text-[#58CC02] text-xs font-black uppercase tracking-widest mb-3 italic">辩论达成共识</div>
                             <p className="text-[15px] font-bold leading-relaxed text-[#2D3436]/80">
                               超分子缓释技术完美解决了“控油效率”与“皮肤受损”之间的矛盾。即使是换季期的敏皮，也能在博主们的验证下放心刷酸。
                             </p>
                           </div>

                           <button className="w-full py-6 bg-[#FF8E9E] text-white rounded-[32px] font-black text-xl duo-button active:translate-y-1">
                             立即领取福利并购买
                           </button>
                        </div>
                     </div>
                  </GlassCard>
                </div>
                
                <div className="flex justify-center">
                   <button onClick={() => setStep('input')} className="text-sm font-black text-gray-400 hover:text-black transition-colors underline underline-offset-8 decoration-2">
                     重新开启咨询模式
                   </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer info */}
        <footer className="pt-12 pb-8 border-t border-gray-100 text-xs font-bold text-gray-400 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <span className="uppercase tracking-widest">© 2026 抖音美妆 AI 实验室</span>
            <span>博长数据：Demo 演示版</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-black cursor-pointer">服务协议</span>
            <span className="hover:text-black cursor-pointer">隐私保护</span>
            <span className="hover:text-black cursor-pointer">意见反馈</span>
          </div>
        </footer>

      </div>

      {/* Floating Glassmorphism AI Voice Input (Cute Style) */}
      {step === 'input' && (
        <motion.div 
          initial={{ y: 100, x: '-50%' }}
          animate={{ y: 0, x: '-50%' }}
          className="fixed bottom-12 left-1/2 w-full max-w-lg px-6 z-50"
        >
          <div className="relative group p-2.5 bg-white/80 backdrop-blur-3xl rounded-full border-b-4 border-black/10 shadow-2xl flex items-center gap-6 cursor-pointer hover:bg-white transition-all active:scale-[0.98]">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#FF9A9E] to-[#FECFEF] rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity" />
            <div className="ml-6 flex items-end gap-1.5 h-10 py-1">
              {[0.4, 0.8, 0.6, 1.0, 0.5, 0.7].map((h, i) => (
                <motion.div 
                  key={i}
                  animate={{ height: ['40%', '100%', '40%'] }}
                  transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                  className="w-1.5 bg-[#FF8E9E] rounded-full" 
                />
              ))}
            </div>
            <span className="flex-1 text-[13px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] opacity-60">
              Listening Now...
            </span>
            <div className="w-14 h-14 bg-[#FF8E9E] rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duo-button">
              <Mic className="text-white w-6 h-6" />
            </div>
          </div>
        </motion.div>
      )}

      <style>{`
        @keyframes blur {
          from { filter: blur(0); }
          to { filter: blur(32px); }
        }
      `}</style>
    </div>
  );
}
