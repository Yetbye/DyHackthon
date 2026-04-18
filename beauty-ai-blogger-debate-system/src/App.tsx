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
  Droplets
} from 'lucide-react';
import { Blogger, Step, DebateRound, Recommendation } from './types';
import { BLOGGERS, KNOWLEDGE_BASE } from './constants';

// --- Components ---

const GlassCard = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={`bg-white border border-white/60 shadow-[var(--shadow)] rounded-[var(--border-radius)] ${className}`}>
    {children}
  </div>
);

const SunflowerTag = ({ text }: { text: string }) => (
  <span className="px-3 py-1 bg-[var(--accent-yellow)] text-black text-xs font-bold rounded-full">
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
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--text-main)] rounded-xl flex items-center justify-center">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight uppercase">DOUYIN <span className="font-light">BEAUTY AI</span></h1>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-[var(--text-secondary)]">
            <span>首页</span>
            <span>博主库</span>
            <div className="px-4 py-1.5 bg-[var(--accent-yellow)] text-black rounded-full text-xs font-bold">
              PROTOTYPE v1.2
            </div>
          </div>
        </header>

        <main>
          <AnimatePresence mode="wait">
            
            {/* Step 1: Input */}
            {step === 'input' && (
              <motion.div 
                key="input"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="space-y-8"
              >
                <div className="text-center space-y-4 pt-12">
                  <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                    你的美妆<span className="text-[var(--accent-yellow)]">辩论</span>智囊团
                  </h2>
                  <p className="text-xl text-[var(--text-secondary)] font-medium">输入你的肤质问题，让专业博主为你“吵个高下”</p>
                </div>

                <div className="relative group max-w-2xl mx-auto">
                  <div className="absolute inset-0 bg-[var(--accent-yellow)]/10 blur-32px rounded-[var(--border-radius)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <GlassCard className="relative p-2 flex items-center gap-4 border border-white/60 group-focus-within:border-[var(--accent-yellow)] transition-colors">
                    <Search className="ml-4 text-[var(--text-secondary)] w-6 h-6" />
                    <input 
                      type="text" 
                      placeholder="例如：油痘肌怎么控油？最近换季总是长闭口..."
                      className="flex-1 bg-transparent py-6 text-xl outline-none placeholder:text-gray-300"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && startToKnowledge()}
                    />
                    <div className="p-4 bg-[var(--text-main)] rounded-[24px] cursor-pointer hover:opacity-90 transition-opacity" onClick={startToKnowledge}>
                      <ArrowRight className="text-white" />
                    </div>
                  </GlassCard>
                  
                  {/* Floating Elements */}
                  <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-4 text-sm font-medium">
                    <button className="px-4 py-2 bg-white/50 backdrop-blur rounded-full border border-white hover:bg-white transition-colors">热门：祛痘印</button>
                    <button className="px-4 py-2 bg-white/50 backdrop-blur rounded-full border border-white hover:bg-white transition-colors">大牌平替</button>
                    <button className="px-4 py-2 bg-white/50 backdrop-blur rounded-full border border-white hover:bg-white transition-colors">敏肌维稳</button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Knowledge */}
            {step === 'knowledge' && (
              <motion.div 
                key="knowledge"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <div className="md:col-span-2 space-y-6">
                  <GlassCard className="p-8 space-y-4 min-h-[300px] flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-[var(--text-secondary)] mb-2">
                      <span className="font-bold uppercase tracking-widest text-[10px]">原理科普</span>
                    </div>
                    <h3 className="text-3xl font-bold">{KNOWLEDGE_BASE.acne.title}</h3>
                    <p className="text-lg text-[var(--text-secondary)] leading-relaxed font-medium">
                      {KNOWLEDGE_BASE.acne.content}
                    </p>
                  </GlassCard>
                  <GlassCard className="p-8 bg-white border-[var(--accent-yellow)]/30 flex items-start gap-4">
                    <div className="p-3 bg-[var(--accent-yellow)] rounded-2xl">
                      <Zap className="text-black w-6 h-6" />
                    </div>
                    <p className="text-lg font-bold italic text-[var(--text-main)]">
                      {KNOWLEDGE_BASE.acne.misconception}
                    </p>
                  </GlassCard>
                </div>
                
                <div className="space-y-6">
                  <h4 className="text-xl font-bold px-4">二次聚焦筛选</h4>
                  <div className="space-y-4">
                    <button onClick={() => handleFocus('A')} className="w-full text-left">
                      <GlassCard className="p-6 hover:bg-blue-50 transition-all hover:scale-[1.02] border-2 border-transparent hover:border-blue-200">
                        <div className="font-bold text-blue-600 mb-1">A. 预算优先</div>
                        <div className="text-xs text-gray-500 font-medium">200元内，高性价比选品方案</div>
                      </GlassCard>
                    </button>
                    <button onClick={() => handleFocus('B')} className="w-full text-left">
                      <GlassCard className="p-6 hover:bg-blue-50 transition-all hover:scale-[1.02] border-2 border-transparent hover:border-blue-200">
                        <div className="font-bold text-blue-600 mb-1">B. 效果优先</div>
                        <div className="text-xs text-gray-500 font-medium">成分硬核，追求极致见效速度</div>
                      </GlassCard>
                    </button>
                    <button onClick={() => handleFocus('C')} className="w-full text-left">
                      <GlassCard className="p-6 hover:bg-blue-50 transition-all hover:scale-[1.02] border-2 border-transparent hover:border-blue-200">
                        <div className="font-bold text-blue-600 mb-1">C. 温和修护</div>
                        <div className="text-xs text-gray-500 font-medium">不刺激，针对爆痘期的敏感状态</div>
                      </GlassCard>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Blogger Selection */}
            {step === 'matching' && (
              <motion.div 
                key="matching"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="flex items-end justify-between px-4">
                  <div className="space-y-1">
                    <h2 className="text-3xl font-bold">为您匹配了 5 位博主</h2>
                    <p className="text-gray-500 font-medium">请从中挑选 3 位进入辩论直播间</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-blue-600">已选 {selectedBloggerIds.length}/3</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {matchedBloggers.map(blogger => (
                    <div 
                      key={blogger.id}
                      onClick={() => toggleBloggerSelection(blogger.id)}
                      className={`cursor-pointer transition-all duration-300 relative rounded-[32px] overflow-hidden group
                        ${selectedBloggerIds.includes(blogger.id) ? 'ring-4 ring-blue-500 ring-offset-4 ring-offset-[#E6F0FF] scale-[1.05] z-10' : 'opacity-80 hover:opacity-100 hover:scale-[1.02]'}
                      `}
                    >
                      <GlassCard className="h-full flex flex-col items-center text-center p-6 space-y-4">
                        <div className="relative">
                          <img src={blogger.avatar} className="w-16 h-16 rounded-2xl object-cover shadow-md" alt={blogger.name} />
                          {selectedBloggerIds.includes(blogger.id) && (
                            <div className="absolute -top-2 -right-2 bg-blue-500 text-white p-1 rounded-full border-2 border-white">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-bold text-lg">{blogger.name}</h3>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{blogger.description}</p>
                        </div>
                        <p className="text-[11px] text-gray-500 font-medium leading-tight">“{blogger.quote}”</p>
                        <div className="pt-2 flex flex-wrap justify-center gap-1">
                          {blogger.tags.slice(0, 2).map(t => (
                            <span key={t} className="px-2 py-0.5 bg-gray-100 text-[9px] font-bold rounded-lg">{t}</span>
                          ))}
                        </div>
                      </GlassCard>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center pt-8">
                  <button 
                    disabled={selectedBloggerIds.length !== 3}
                    onClick={startDebate}
                    className={`px-12 py-5 rounded-[24px] font-bold text-xl flex items-center gap-2 transition-all shadow-xl
                      ${selectedBloggerIds.length === 3 ? 'bg-black text-white hover:scale-110 active:scale-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                    `}
                  >
                    <MessageSquare /> 开始辩论
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Debate */}
            {step === 'debate' && (
              <motion.div 
                key="debate"
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex -space-x-4">
                    {selectedBloggers.map(b => (
                      <img key={b.id} src={b.avatar} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="" />
                    ))}
                    <div className="ml-8 font-bold flex items-center gap-2">
                      <span className="text-red-500 animate-pulse">●</span>
                      美妆辩论进行中...
                    </div>
                  </div>
                  <div className="bg-white/50 px-4 py-2 rounded-full text-sm font-bold border border-white">
                    轮次 {Math.ceil((currentRound + 1) / 3)} / 5
                  </div>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                  {debateRounds.slice(0, currentRound + 1).map((round, idx) => {
                    const blogger = selectedBloggers.find(b => b.name === round.speaker);
                    const isLeft = idx % 2 === 0;
                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={idx}
                        className={`flex gap-4 ${isLeft ? '' : 'flex-row-reverse'}`}
                      >
                        <div className="flex-shrink-0">
                          <img src={blogger?.avatar} className="w-12 h-12 rounded-2xl object-cover border-2 border-[var(--accent-yellow)]" alt="" />
                        </div>
                        <div className={`space-y-1 max-w-[85%]`}>
                          <div className={`text-[10px] uppercase tracking-wider font-bold text-[var(--text-secondary)] px-1 ${isLeft ? '' : 'text-right'}`}>{round.speaker}</div>
                          <div className={`p-5 rounded-[20px] text-[15px] leading-relaxed font-medium ${isLeft ? 'bg-[#F2F2F7] rounded-tl-none' : 'bg-[#E6F0FF] rounded-tr-none border border-blue-500/10'}`}>
                            {round.content}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                  <div id="debate-end" />
                </div>

                {!isDebating && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center pt-8"
                  >
                    <button 
                      onClick={goToResult}
                      className="px-12 py-5 bg-[#FFD700] text-black rounded-[24px] font-bold text-xl flex items-center gap-2 hover:scale-110 active:scale-95 transition-all shadow-xl"
                    >
                      查看最终推荐方案 <ChevronRight />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Step 5: Result */}
            {step === 'result' && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-4xl font-bold flex items-center justify-center gap-3">
                    为您最终决策
                  </h2>
                  <p className="text-[var(--text-secondary)] font-medium italic">目前 2/3 博主达成共识：该产品适配您的肤质评价</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Primary Product */}
                  <GlassCard className="md:col-span-8 p-10 relative overflow-hidden flex flex-col md:flex-row gap-8 items-center border-4 border-white">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700] rotate-45 translate-x-16 -translate-y-16 flex items-end justify-center pb-4 pr-12">
                      <span className="text-black font-black text-xs -rotate-45">首选方案</span>
                    </div>
                    
                    <div className="w-48 h-48 bg-gray-100 rounded-[32px] flex items-center justify-center relative shadow-inner">
                      <ShoppingBag className="w-16 h-16 text-gray-300" />
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold opacity-20">Sample Product</div>
                    </div>

                    <div className="flex-1 space-y-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <SunflowerTag text="博乐达" />
                          <SunflowerTag text="官方授权" />
                        </div>
                        <h3 className="text-3xl font-black">超分子水杨酸面膜</h3>
                        <div className="text-4xl font-black text-blue-600">¥128.<span className="text-lg">00</span></div>
                      </div>

                      <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                        <div className="flex items-center gap-2 text-blue-600 font-black text-xs mb-2 italic">
                          <CheckCircle2 className="w-4 h-4" /> 推荐理由
                        </div>
                        <p className="text-sm font-medium leading-relaxed text-blue-900">
                          三位博主的一致共识点在于：该产品采用超分子缓释技术，既保证了控油祛痘的硬核程度，又显著降低了刺激感。特别契合您“预算200内”且“偶尔敏感”的诉求，长期维稳效果极佳。
                        </p>
                      </div>

                      <button className="w-full py-5 bg-black text-white rounded-[24px] font-black tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
                        立即前往抖音电商购买 <ChevronRight />
                      </button>
                    </div>
                  </GlassCard>

                  {/* Secondary & Tips */}
                  <div className="md:col-span-4 space-y-6">
                    <GlassCard className="p-8 space-y-4 border-2 border-gray-100/50">
                      <h4 className="font-black flex items-center gap-2">
                        <Users className="w-5 h-5" /> 备选方案
                      </h4>
                      <div className="p-4 bg-gray-50 rounded-2x border border-dashed border-gray-200">
                        <div className="font-bold text-sm">理肤泉 K乳 (K+)</div>
                        <p className="text-[11px] text-gray-400 font-medium">更侧重针对黑头闭口，价格略高</p>
                      </div>
                    </GlassCard>

                    <GlassCard className="p-8 space-y-4 bg-[#FFC107]/5 border-[#FFC107]/20">
                      <h4 className="font-black flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-yellow-600" /> 护肤步骤
                      </h4>
                      <div className="space-y-4 text-sm font-medium">
                        <div className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                            <div className="w-0.5 flex-1 bg-yellow-200" />
                          </div>
                          <div>AM: 氨基酸洁面 → 补水喷雾 → 玻尿酸保湿液</div>
                        </div>
                        <div className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                            <div className="w-0.5 flex-1 bg-yellow-200" />
                          </div>
                          <div>PM: 卸妆 → 洁面 → <span className="underline font-black text-black">超分子水杨酸</span> → 舒缓面霜</div>
                        </div>
                      </div>
                    </GlassCard>
                    
                    <button 
                      onClick={() => setStep('input')}
                      className="w-full py-4 text-sm font-bold text-gray-400 hover:text-black transition-colors"
                    >
                      重新开始咨询?
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer info */}
        <footer className="pt-12 pb-8 border-t border-gray-100 text-xs font-bold text-gray-400 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <span className="uppercase tracking-widest">© 2026 抖音美妆 AI 实验室</span>
            <span>博主数据：Demo 演示版</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-black cursor-pointer">服务协议</span>
            <span className="hover:text-black cursor-pointer">隐私保护</span>
            <span className="hover:text-black cursor-pointer">意见反馈</span>
          </div>
        </footer>

      </div>

      {/* AI Voice Input Component (Glassmorphism inspired) */}
      {step === 'input' && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-lg px-6"
        >
          <div className="relative group p-1.5 bg-[var(--glass-bg)] backdrop-blur-3xl rounded-full border border-white/50 shadow-2xl flex items-center gap-6 cursor-pointer">
            <div className="ml-6 flex items-center gap-1.5 h-12">
              <div className="w-0.5 h-4 bg-[var(--text-main)] rounded-full animate-pulse" />
              <div className="w-0.5 h-8 bg-[var(--text-main)] rounded-full animate-pulse delay-75" />
              <div className="w-0.5 h-6 bg-[var(--text-main)] rounded-full animate-pulse delay-150" />
              <div className="w-0.5 h-10 bg-[var(--text-main)] rounded-full animate-pulse delay-300" />
              <div className="w-0.5 h-5 bg-[var(--text-main)] rounded-full animate-pulse delay-500" />
            </div>
            <span className="flex-1 text-sm font-semibold text-[var(--text-secondary)] italic">
              "我想了解一下那个89元的品牌..."
            </span>
            <div className="w-12 h-12 bg-[var(--text-main)] rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
              <Mic className="text-white w-6 h-6" />
            </div>
          </div>
        </motion.div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #D1D5DB;
          border-radius: 10px;
        }
        @keyframes blur {
          from { filter: blur(0); }
          to { filter: blur(32px); }
        }
      `}</style>
    </div>
  );
}
