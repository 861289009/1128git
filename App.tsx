
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Play,
  Ticket,
  MapPin,
  Calendar,
  Music,
  Zap,
  Globe,
  Users,
  Cpu,
  Radio,
  Sparkles,
  Coffee,
  Heart,
  ChevronRight,
  ChevronLeft,
  X,
  Box,
  Eye,
  Fingerprint,
  Thermometer,
  Wind,
  Menu, Speaker, Lightbulb, Layers
} from 'lucide-react';
import FluidBackground from './components/FluidBackground';
import GradientText from './components/GlitchText';
import CustomCursor from './components/CustomCursor';
import ArtistCard from './components/ArtistCard';
import { Artist } from './types';
import DoraemonWidget from './components/DoraemonWidget';
import FeatureSection from './components/FeatureSection';
import PersonalInfo from './components/PersonalInfo';
import ContactModal from './components/ContactModal';
import ResumeModal from './components/ResumeModal';
import { resolveImage } from './assets/imageResolver';


// Dummy Data
const LINEUP: Artist[] = [
  {
    id: '1',
    name: '模型效果调优',
    genre: 'Model performance optimization',
    day: '2 case',
    image: resolveImage('moxty.webp'),
    description: '基础提示词生图是当前大模型商业化落地应用最广泛的场景,其营收占比超过50%。总体而言,客户需求较大,通常一个章节或分镜需配备一张图。此类客户通常会提供参考图,并期望我们能提供可复刻参考图风格的prompt参考,从而降低使用门槛,简化生图流程,稳定出图效果。\n        具体支持包含三星,Dashtoon,阿里巴巴,易点,360,Glance,vivo,小米,货拉拉,wps,微博,美的,阅文等头部公司在内的30+客户。覆盖数百万业务场景。'
  },
  {
    id: '2',
    name: '模型训练',
    genre: 'Model training',
    day: '2 case',
    image: resolveImage('moxxl.webp'),
    description: '支持训练1.5,xl,Flux,3.0,4.0图像Lora;指令编辑Lora和视频Lora。\n        具体负责从需求调研至最终交付的工作,针对不同客户不同阶段的需求,提供个性化解决方案。并在项目结束后整理改建通用工作流,提升工作效率,助力后续同类型需求在短时间内解决。\n        目前,Lora定制方案已积累了82种风格,其中21种风格已在荣耀、核芯互乐、广州文旅等多家客户处上线。其产品力处于国内第一梯队(效果精细、人脸相似度高,已通过字节内部验证,且品类丰富,风格模板持续更新)'
  },
  {
    id: '3',
    name: '工作流制作',
    genre: 'Workflow production',
    day: '3 case',
    image: resolveImage('gzl.webp'),
    description: '主导工作流全流程落地，具体包含：前期的需求沟通对接 → 目标逻辑架构搭建 → 方案设计与开发实现 → 压力测试与优化 → 最终交付算法上线部署，确保全链路高效闭环。\n        业务场景落地：\n        - 通用提效类：覆盖面部数值检测、电商换背景等十余个标准化场景，输出可复用工作流方案，提升业务通用处理效率。\n        - 定制化服务类：聚焦银行、汽车等行业客户需求，设计专属工作流，通过参数打包绑定对应 ID 的交付模式，精准匹配客户个性化业务场景。'
  },
  {
    id: '4',
    name: '模板效果积累',
    genre: 'Template effect accumulation',
    day: '1 case',
    image: resolveImage('moxignxiaoguo.webp'),
    description: '构建覆盖模板、支持、能力三大维度的资源体系，除模板 Lora、模板风格、模板工作流外，同步完善场景问题 oncall 答复模板、视频能力库、插件能力库，形成全链路支撑矩阵。\n        目标和解决方案:\n1. 构建图片和视频模板库，最大程度地输出多样的风格，以供客户了解豆包大模型的成效并进行选用。\n2. 编制提示词指导手册，使客户明晰提示词的书写格式。\n3. 探究测试提示词中标点符号、位置顺序对风格的影响程度，规范整理出一套提示词书写格式。\n4. 提前预研风格/玩法，“走在客户前面”，丰富客户灵感，提高上线率和调用量。'
  },
  {
    id: '5',
    name: '技术调研评估',
    genre: 'Technical survey and evaluation',
    day: '0 case',
    image: resolveImage('diaoyan.webp'),
    description: '负责部门全领域技术生态调研与商业化评估，通过系统性分析开源资源、第三方插件及友商核心能力，为技术选型、功能迭代及差异化竞争提供决策支撑，推动多项技术落地转化：\n        开源资源深度挖掘：定向跟踪 C 站、Liblibai 等平台 Top 级模型及 GitHub、Hugging Face 高星插件，累计筛选出 12 款可直接复用的图像生成模型及 8 个插件工具，降低自研部署成本约 30%，加速 3 个核心功能上线周期。\n        友商竞品全景分析：针对可灵、Vidu、海螺、Qwen、MJ、混元 3D、GPT-5、Gemini 3 、Nano Banana Pro等 10 + 主流产品，分析大语言、图像、视频、音频、3D 及插件六大领域。其中，基于Gemini3大语言模型结合coze搭建模型问题自动回复的agent和手动打标小程序，大幅提高部门工作效率。'
  },
  {
    id: '6',
    name: '其他',
    genre: 'Other',
    day: '2 case',
    image: resolveImage('qt.webp'),
    description: '能够使用多类型设计软件辅助处理图像/视频，包含ai生成后期调整，训练集制作调整等内容。\n        具体包含熟练运用 PS、Figma 完成平面设计与 AI 生成图像后期调整，借助 Maya、Blender 开展 3D 建模及训练集 3D 素材优化；结合 AI 技术进行前端设计适配，使用 PR、达芬奇、剪映实现视频剪辑调色与 AI 生成视频的后期处理，可独立完成 AI 训练集的制作与调整工作等。'
  },
];

function App() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [isResumeModalOpen, setResumeModalOpen] = useState(false);

  const [purchasingIndex, setPurchasingIndex] = useState<number | null>(null);
  const [purchasedIndex, setPurchasedIndex] = useState<number | null>(null);
  const [activeModal, setActiveModal] = useState<'day' | 'weekend' | 'astral' | null>(null);

  // Handle keyboard navigation for artist modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedArtist) return;
      if (e.key === 'ArrowLeft') navigateArtist('prev');
      if (e.key === 'ArrowRight') navigateArtist('next');
      if (e.key === 'Escape') setSelectedArtist(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedArtist]);

  const handlePurchase = (index: number) => {
    // Open specific modal based on ticket type
    if (index === 0) {
      setActiveModal('day');
      return;
    }
    if (index === 1) {
      setActiveModal('weekend');
      return;
    }
    if (index === 2) {
      setActiveModal('astral');
      return;
    }

    setPurchasingIndex(index);
    setTimeout(() => {
      setPurchasingIndex(null);
      setPurchasedIndex(index);
    }, 2000);
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const navigateArtist = (direction: 'next' | 'prev') => {
    if (!selectedArtist) return;
    const currentIndex = LINEUP.findIndex(a => a.id === selectedArtist.id);
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % LINEUP.length;
    } else {
      nextIndex = (currentIndex - 1 + LINEUP.length) % LINEUP.length;
    }
    setSelectedArtist(LINEUP[nextIndex]);
  };

  return (
    <div className="relative min-h-screen text-black selection:bg-[#4fb7b3] selection:text-white cursor-auto md:cursor-none overflow-x-hidden">
      <CustomCursor />
      <FluidBackground />
      <DoraemonWidget />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-8 py-6 mix-blend-difference">
        <div className="font-heading text-xl md:text-2xl font-bold tracking-tighter text-white cursor-default z-50">wyz</div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-10 text-sm font-bold tracking-widest uppercase text-white">
          <button
            onClick={scrollToTop}
            className="hover:opacity-80 transition-opacity text-white cursor-pointer bg-transparent border-none"
            data-hover="true"
          >
            顶部
          </button>
          <button
            onClick={() => scrollToSection('lineup')}
            className="hover:opacity-80 transition-opacity text-white cursor-pointer bg-transparent border-none"
            data-hover="true"
          >
            目录
          </button>
          <button
            onClick={() => scrollToSection('footer')}
            className="hover:opacity-80 transition-opacity text-white cursor-pointer bg-transparent border-none"
            data-hover="true"
          >
            联系方式
          </button>
        </div>
        <button
          onClick={() => setResumeModalOpen(true)}
          className="hidden md:inline-block border border-white px-8 py-3 text-xs font-bold tracking-widest uppercase transition-opacity duration-300 text-white cursor-pointer bg-transparent hover:opacity-80"
          data-hover="true"
        >
          查看简历
        </button>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white z-50 relative w-10 h-10 flex items-center justify-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            <button
              onClick={scrollToTop}
              className="text-4xl font-heading font-bold text-black hover:text-[#2d8a86] transition-colors uppercase bg-transparent border-none"
            >
              顶部
            </button>
            <button
              onClick={() => scrollToSection('lineup')}
              className="text-4xl font-heading font-bold text-black hover:text-[#2d8a86] transition-colors uppercase bg-transparent border-none"
            >
              目录
            </button>
            <button
              onClick={() => scrollToSection('footer')}
              className="text-4xl font-heading font-bold text-black hover:text-[#2d8a86] transition-colors uppercase bg-transparent border-none"
            >
              联系方式
            </button>
            <button
              onClick={() => setResumeModalOpen(true)}
              className="mt-8 border border-black px-10 py-4 text-sm font-bold tracking-widest uppercase bg-black text-white"
            >
              查看简历
            </button>

            <div className="absolute bottom-10 flex gap-6">
              <a href="https://x.com/GoogleAIStudio" className="text-black/50 hover:text-black transition-colors">Twitter</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
        pdfUrl={resolveImage('101.webp')}
      />

      {/* HERO SECTION */}
      <header className="relative h-[100svh] min-h-[600px] flex flex-col items-center justify-center overflow-hidden px-4">
        {/* Interactive Mouse Particles Layer */}


        <motion.div
          style={{ y, opacity }}
          className="z-10 text-center flex flex-col items-center w-full max-w-6xl pb-24 md:pb-20"
        >
          {/* Date / Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex items-center gap-3 md:gap-6 text-xs md:text-base font-mono text-black/80 tracking-[0.2em] md:tracking-[0.3em] uppercase mb-4 bg-white/40 px-4 py-2 rounded-full backdrop-blur-sm border border-black/5"
          >
            <span>BEI JING</span>
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#4fb7b3] rounded-full animate-pulse" />
            <span>NOV 15-29</span>
          </motion.div>

          {/* Main Title */}
          <div className="relative w-full flex justify-center items-center">
            <GradientText
              text="Portfolio"
              as="h1"
              className="text-[11vw] md:text-[9vw] leading-[0.9] font-black tracking-wider md:tracking-[0.08em] text-center"
            />
            {/* Optimized Orb - Darker for visibility on white */}
            <motion.div
              className="absolute -z-20 w-[50vw] h-[50vw] bg-black/5 blur-[40px] rounded-full pointer-events-none will-change-transform"
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 6, repeat: Infinity }}
              style={{ transform: 'translateZ(0)' }}
            />
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
            className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-black/50 to-transparent mt-4 md:mt-8 mb-6 md:mb-8"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-base md:text-2xl font-light max-w-xl mx-auto text-black/80 leading-relaxed px-4"
          >
            Welcome to WYZ's portfolio
          </motion.p>
        </motion.div>

        {/* MARQUEE - Strong gradient per user request */}
        <div className="absolute bottom-12 md:bottom-16 left-0 w-full py-4 md:py-6 bg-gradient-to-r from-[#a8fbd3] via-[#4fb7b3] to-[#637ab9] backdrop-blur-md text-white z-20 overflow-hidden border-y border-white/20 shadow-lg">
          <motion.div
            className="flex w-fit will-change-transform"
            animate={{ x: "-50%" }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            {/* Duplicate content for seamless loop */}
            {[0, 1].map((loopIdx) => (
              <div key={`marquee-loop-${loopIdx}`} className="flex whitespace-nowrap shrink-0">
                {[...Array(4)].map((_, i) => (
                  <span key={`marquee-item-${loopIdx}-${i}`} className="text-3xl md:text-7xl font-heading font-black px-8 flex items-center gap-4">
                    <span className="tracking-wider md:tracking-[0.12em]">Portfolio 2025</span> <span className="text-white text-2xl md:text-4xl">●</span>
                    AIGC DESIGNER <span className="text-white text-2xl md:text-4xl">●</span>
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </header>

      {/* PERSONAL INFO SECTION */}
      <PersonalInfo />

      {/* UNIFIED CONTENT CONTAINER */}
      <div className="relative z-10 bg-gradient-to-b from-white/70 via-white/65 to-white/60 backdrop-blur-md overflow-visible transition-colors duration-500">
        {/* Ambient Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Soft Gradient Blobs - Significantly increased opacity */}
          {/* Removed static blobs as fluid background is now visible */}
        </div>

        {/* LINEUP SECTION */}
        <section id="lineup" className="relative pt-8 md:pt-12 pb-10 md:pb-14">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6">
            <div className="flex flex-col justify-start items-start mb-12 md:mb-16 px-4 overflow-visible">
              <h2 className="text-5xl md:text-8xl font-heading font-bold leading-[1.3] break-words w-full md:w-auto text-black drop-shadow-xl mt-0 md:mt-0 mb-0">
                <GradientText text="工作内容概述" as="span" className="text-3xl md:text-5xl leading-[1.4] top-[2px] font-heading font-bold font-black uppercase drop-shadow-xl" />
              </h2>
              <p className="text-base md:text-xl text-[#2d8a86] font-medium tracking-wide mt-0">Work Overview</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-white/50 backdrop-blur-sm rounded-3xl overflow-hidden shadow-sm border border-black/5">
              {LINEUP.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} onClick={() => setSelectedArtist(artist)} />
              ))}
            </div>
          </div>
        </section>

        {/* CASES TITLE BETWEEN LINEUP AND CONTENT SECTIONS */}
        <section id="cases-title" className="relative pt-6 md:pt-8 pb-2 md:pb-4">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6">
            <div className="flex flex-col justify-start items-start mb-12 md:mb-16 px-4 overflow-visible">
              <h2 className="text-5xl md:text-8xl font-heading font-bold leading-[1.3] break-words w-full md:w-auto text-black drop-shadow-xl mt-0 md:mt-0 mb-0">
                <GradientText text="具体工作案例" as="span" className="text-3xl md:text-5xl leading-[1.4] top-[2px] font-heading font-bold font-black uppercase drop-shadow-xl" />
              </h2>
              <p className="text-base md:text-xl text-[#2d8a86] font-medium tracking-wide mt-0">Case Studies</p>
            </div>
          </div>
        </section>

        {/* EXPERIENCE SECTION - BEYOND REALITY (04) */}
        <FeatureSection
          id="experience"
          titlePrefix="Beyond"
          titleSuffix="REALITY"
          isReversed={false}
          layoutVariant="standard"
          containerClassName="mt-[-16px] md:mt-[-28px]"
          overlayAlign="right"
          slides={[
            {
              titlePrefix: "模型效果优化",
              titleSuffix: "蔚来案例",
              description: "需要根据蔚来汽车客户的入参（季节，天气，地点等），生成指定风格提示词，并通过模型生图",
              features: [
                { icon: Lightbulb, title: '解决思路', desc: '根据入参，调整提示词结构并寻找适合扩写模型的强度，预设地点，打包为伪随机参数，提高生图稳定性。' },
                { icon: Zap, title: '最终效果', desc: '在多个友商竞标中脱颖而出，成功为部门争取到这个项目。' },
                {
                  icon: Layers,
                  title: '客户案例入参',
                  table: {
                    headers: ['景点', '地点', '季节', '时间', '天气'],
                    rows: [
                      ['熊猫基地', '成都市', '春天', '中午', '晴'],
                      ['李鸿章故居', '合肥市', '秋天', '傍晚', '晴'],
                      ['迪士尼', '上海市', '秋天', '夜晚', '晴']
                    ],
                    columnWidths: ['calc(25% + 35px)', 'auto', 'auto', 'auto', 'auto']
                  }
                },
              ],
              image: resolveImage('1.webp'),
              number: "01-1",
              label: "Seedream 3.0L"
            },
            {
              titlePrefix: "模型效果调优",
              titleSuffix: "美图案例",
              description: "美图客户需要优化并稳定生图效果。将两个人物放在一张图片中做出自拍动作并合影",
              features: [
                { icon: Zap, title: '解决思路', desc: '指导客户固定提示词结构,根据模型特性,选择效果强的提示词来主导生图效果,减少多余无效的提示词。采用多方案结合的形式。(例如:模型出图后接入面部特征保持服务等技术)最终效果:各大平台竞相模仿,爆火全网。' },
                { icon: Sparkles, title: '最终效果', desc: '各大平台竞相模仿,爆火全网。' },
              ],
              image: resolveImage('32.webp'),
              number: "01-2",
              label: "seedream 4.0"
            }
          ]}
        />

        {/* NEW SECTION 1 - DIGITAL DREAMS (05) */}
        <FeatureSection
          id="digital-dreams"
          titlePrefix="Digital"
          titleSuffix="DREAMS"
          description="Wander through forests of fiber optics and oceans of pixels. Our installation artists craft realities that respond to your presence."
          features={[
            { icon: Sparkles, title: 'Holo-Gardens', desc: 'Flora made of pure light and data.' },
            { icon: Cpu, title: 'AI Architecture', desc: 'Structures that evolve in real-time.' },
            { icon: Zap, title: 'Laser Forests', desc: 'Dense canopies of coherent light.' },
          ]}
          image="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop"
          number="05"
          label="Visual Immersion"
          isReversed={true}
          layoutVariant="standard"
          overlayAlign="left"
          slides={[
            {
              titlePrefix: "模型训练",
              titleSuffix: "荣耀案例",
              description: "荣耀海外客户需要定制专属风格Lora",
              features: [
                { icon: Sparkles, title: '解决思路', desc: '制作统一调用的工作流。根据网络热门风格，挑选适合制作的风格进行立项。收集训练集，打标训练。统一收集至Lora风格模板供客户直接挑选购买。' },
                { icon: Eye, title: '最终效果', desc: '荣耀客户定制购买包含莫奈，水彩风格在内的10+风格。成为当时部门25%计收来源' },
              ],
              image: resolveImage('53.webp'),
              number: "02-1",
              label: "Model customization"
            },
            {
              titlePrefix: "模型训练",
              titleSuffix: "北汽案例",
              description: "极狐汽车定制超宽比例构图Lora",
              features: [
                { icon: Box, title: '制作难点', desc: '需要能够在特殊构图比例下，精准控制车型，保持车标，改变图片风格。满足客户需求' },
                { icon: Sparkles, title: '解决思路', desc: '根据客户素材图一次制作flux模型Lora，再通过大批量跑图挑选生成千张级训练集，整理效果稳定的图片进行二次制作Lora。通过mask等方式精准识别还原车标logo等细节。定制agent，辅助客户撰写提示词。' },
                { icon: Zap, title: '最终效果', desc: '成功计收上线客户平台' },
              ],
              image: resolveImage('42.webp'),
              number: "02-2",
              label: "Model customization"
            }
          ]}
        />

        {/* NEW SECTION 2 - SONIC HORIZONS (06) */}
        <FeatureSection
          id="sonic-horizons"
          titlePrefix="Sonic"
          titleSuffix="HORIZONS"
          description="Experience audio fidelity that defies physics. Our 360-degree spatial sound systems immerse you completely in the music."
          features={[
            { icon: Speaker, title: '360° Audio', desc: 'Sound that moves around you.' },
            { icon: Radio, title: 'Silent Disco', desc: '3 channels of curated beats.' },
            { icon: Music, title: 'Bass Therapy', desc: 'Frequencies that heal.' },
          ]}
          image="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop"
          number="06"
          label="Audio Fidelity"
          layoutVariant="split"
          overlayAlign="right"
          slides={[
            {
              titlePrefix: "工作流制作",
              titleSuffix: "电商换背景",
              description: "基础能力类工作流",
              features: [
                { icon: Radio, title: '具体功能', desc: '1.基于私部规范及保密要求，采用 “开源 + 内部” 双轨部署模式，兼顾通用性与数据安全。\n2.集成自动识别透明底、智能调节抠图模型等十余项核心功能，既满足客户多样化换背景需求，也为设计侧后期定制调整提供灵活支撑。' },
                { icon: Sparkles, title: '核心功能', desc: '替换背景，识别通道，指定抠图，提换光影，保持光影' },
                { icon: Zap, title: '最终效果', desc: '主导高需求电商换背景工作流设计与落地，日均调用量超 30W+，支撑大规模业务场景高效运转。' },
                { icon: Globe, title: '官网产品/接口文档', desc: '', link: { href: 'https://www.volcengine.com/docs/85621/1965106' } },
              ],
              image: resolveImage('62.webp'),
              number: "03-1",
              label: "workflow customization"
            },
            {
              titlePrefix: "工作流制作",
              titleSuffix: "图片裂变",
              description: "模板ID定制工作流",
              features: [
                { icon: Zap, title: '核心能力', desc: '集成 VLM 图像信息反推、LLM 提示词扩写裂变、伪随机词库、智能文字生成、logo 贴纸自动识别还原等 20 余项功能，通过模板 ID 打包预设参数，实现客户 “一键调用即生成达标素材” 的高效体验，大幅降低批量创作门槛。' },
                { icon: Heart, title: '最终效果', desc: '主导大型投流裂变工作流设计与落地，聚焦多客户大批量宣传图 / 封面图生成需求，支持单张图片裂变千万种差异化版本（含文字、内容元素等多维变体），单客户日均调用量超 10w+。' },
              ],
              image: resolveImage('72.webp'),
              number: "03-2",
              label: "workflow customization"
            },
            {
              titlePrefix: "工作流制作",
              titleSuffix: "反推扩写",
              description: "前置扩展型工作流",
              features: [
                { icon: Radio, title: '设计目标', desc: '设计开发轻量高效的前置扩展型工作流，作为插件服务支持独立部署，亦可拆解集成至大型工作流中复用。' },
                { icon: Users, title: '最终效果', desc: '核心价值在于辅助客户高效生成适配提示词，通过 ID 打包模板输出多样化结果，涵盖三大核心场景：文字内容生成扩写、图片参考导向扩写、IP 特征匹配扩写，为下游创作环节提供精准输入支撑。' },
              ],
              image: resolveImage('73.webp'),
              number: "03-3",
              label: "workflow customization"
            }
          ]}
        />



        {/* NEW SECTION 3 - TASTE SYNTHESIS (07) */}
        <FeatureSection
          id="taste-synthesis"
          titlePrefix="Taste"
          titleSuffix="SYNTHESIS"
          description="Fuel your journey with gastronomy from the future. Molecular cocktails and bio-luminescent treats await your palette."
          features={[
            { icon: Coffee, title: 'Neural Food', desc: 'Nutrients designed for energy.' },
            { icon: Zap, title: 'Bio-Bites', desc: 'Glowing snacks for the night.' },
            { icon: Sparkles, title: 'Nano-Cocktails', desc: 'Flavor changing beverages.' },
          ]}
          image="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop"
          number="07"
          label="Culinary Labs"
          layoutVariant="stacked"
          overlayAlign="right"
          showArrows={false}
          slides={[
            {
              titlePrefix: "模板效果积累",
              titleSuffix: "效果库搭建",
              description: "输出模板案例，整理团队资源，提高工作效率",
              features: [
                { icon: Coffee, title: '图像模板', desc: '制作文生图/图生图等图像模板50余个' },
                { icon: Zap, title: '视频模板', desc: '制作文生视频/首尾帧视频/多帧视频模板合计20余种' },
                { icon: Sparkles, title: '常见badcase修复模板', desc: '3.0/4.0等常用模型累计badcase解决方案10余类' },
              ],
              image: resolveImage('83.webp'),
              number: "04-1",
              label: "Template effect accumulation"
            }
          ]}
        />

        {/* NEW SECTION 4 - HUMAN NETWORK (08) */}
        <FeatureSection
          id="human-network"
          titlePrefix="Human"
          titleSuffix="NETWORK"
          description="Connect with thousands of other travelers on the same wavelength. The energy of the crowd powers the festival."
          features={[
            { icon: Users, title: 'Avatar Sync', desc: 'Digital twins for everyone.' },
            { icon: Globe, title: 'Global Connect', desc: 'Live stream to 5 continents.' },
            { icon: Heart, title: 'Unity Pulse', desc: 'Synchronized wristbands.' },
          ]}
          image="https://images.unsplash.com/photo-1459749411177-287ce35e8b95?q=80&w=1000&auto=format&fit=crop"
          number="08"
          label="Community"
          isReversed={true}
          layoutVariant="standard"
          overlayAlign="left"
          slides={[
            {
              titlePrefix: "其他",
              titleSuffix: "3D效果",
              description: "",
              features: [
                { icon: Users, title: '核心能力', desc: '3D能力具体包含：基础模型制作，基础效果制作，UV和贴图处理，捆绑，动画制作等。' },
                { icon: Globe, title: '最终效果', desc: '辅助制作特殊模板，辅助制作图像/视频模型训练集，提升部分工作效率' },
              ],
              image: resolveImage('1127.webp'),
              number: "05-1",
              label: "blander"
            },
            {
              titlePrefix: "其他",
              titleSuffix: "平面制作",
              description: "",
              features: [
                { icon: Heart, title: '核心能力', desc: '图片处理能力，基础修图，调色，蒙板制作，前端figma网页设计等' },
                { icon: Zap, title: '最终效果', desc: '辅助处理制作优质图像模型训练集，基础官网页面制作' },
              ],
              image: resolveImage('84.webp'),
              number: "05-2",
              label: "photoshop"
            }
          ]}
        />



        {/* TICKETS SECTION */}
        <section id="tickets" className="relative py-20 md:py-32 px-4 md:px-6 overflow-hidden">


          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-20">
              <h2 className="text-5xl md:text-9xl font-heading font-bold opacity-10 text黑">
                联系方式
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Email', price: '邮箱', color: 'orang', accent: 'bg-black/5' },
                { name: 'Phone number', price: '电话号', color: 'te', accent: 'bg-[#4fb7b3]/10 border-[#4fb7b3]/30' },
                { name: 'QQ/WECHAT', price: 'QQ/微信', color: 'periwinkle', accent: 'bg-[#637ab9]/10 border-[#637ab9]/30' },
              ].map((ticket, i) => {
                const isPurchasing = purchasingIndex === i;
                const isPurchased = purchasedIndex === i;
                const isDisabled = (purchasingIndex !== null) || (purchasedIndex !== null);

                return (
                  <motion.div
                    key={i}
                    whileHover={isDisabled ? {} : { y: -10 }}
                    className={`relative p-6 md:p-8 border border-black/10 backdrop-blur-md flex flex-col min-h-[250px] md:min-h-[300px] transition-colors duration-300 ${ticket.accent} ${isDisabled && !isPurchased ? 'opacity-50 grayscale' : ''} will-change-transform`}
                    data-hover={!isDisabled}
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-black/20 to-transparent" />

                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-xl md:text-2xl font-heading font-bold mb-2 text-black">{ticket.name}</h3>
                      <div className={`text-4xl md:text-5xl font-bold tracking-tighter ${ticket.color === 'black' ? 'text-black' : ticket.color === 'teal' ? 'text-[#2d8a86]' : 'text-[#435585]'}`}>
                        {ticket.price}
                      </div>
                    </div>

                    <button
                      onClick={() => handlePurchase(i)}
                      disabled={isDisabled}
                      className={`w-full py-3 text-sm font-bold uppercase tracking-[0.2em] border border-black/20 transition-all duration-300 mt-4 group overflow-hidden relative 
                        ${isPurchased
                          ? 'bg-[#a8fbd3] text-black border-[#a8fbd3] cursor-default'
                          : isPurchasing
                            ? 'bg-black/20 text-black cursor-wait'
                            : isDisabled
                              ? 'cursor-not-allowed opacity-50'
                              : 'text-black cursor-pointer hover:bg-black hover:text-white'
                        }`}
                    >
                      <span className="relative z-10">
                        {isPurchasing ? 'Getting...' : isPurchased ? 'Got' : 'Get'}
                      </span>
                      {/* Only show hover effect if actionable */}
                      {!isDisabled && !isPurchased && !isPurchasing && (
                        <div className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out -z-0" />
                      )}
                    </button>

                    {isPurchased && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-center mt-2 text-black/40 font-mono"
                      >
                        Demo site: no purchase was made
                      </motion.p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <footer id="footer" className="relative py-12 md:py-16 overflow-hidden">


          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div>
              <div className="font-heading text-3xl md:text-4xl font-bold tracking-wider md:tracking-[0.12em] mb-4 text-black">Portfolio-wyz</div>
              {/* Removed attribution line per request */}
            </div>
            <div className="flex flex-col items-end">
              <span className="text-gray-500 text-xs md:text-sm font-mono">
                整个网页独立制作，仅供学习交流使用
              </span>
              <span className="text-gray-500 text-[10px] md:text-xs font-mono mt-1">
                包含：html，内容素材，沙包agent
              </span>
            </div>
          </div>
        </footer>
      </div>

      {/* Artist Detail Modal */}
      <AnimatePresence>
        {selectedArtist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedArtist(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-white/60 backdrop-blur-md cursor-auto"
          >
            {/* Fixed Close Button - Top Right of Screen */}
            <button
              onClick={() => setSelectedArtist(null)}
              className="fixed top-6 right-6 z-[70] p-2 rounded-full bg-black/10 text-black hover:bg-black hover:text-white transition-colors backdrop-blur-sm border border-black/10"
              data-hover="true"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0, x: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, info) => {
                // Swipe right (positive offset) = previous artist
                if (info.offset.x > 100) {
                  navigateArtist('prev');
                }
                // Swipe left (negative offset) = next artist
                else if (info.offset.x < -100) {
                  navigateArtist('next');
                }
              }}
              className="relative w-full max-w-5xl bg-white border border-black/10 md:overflow-hidden overflow-y-auto max-h-[90vh] flex flex-col md:flex-row shadow-2xl shadow-black/10 group/modal cursor-grab active:cursor-grabbing"
            >
              {/* Navigation Buttons */}
              <button
                onClick={(e) => { e.stopPropagation(); navigateArtist('prev'); }}
                className="absolute -left-4 top-1/2 -translate-y-1/2 md:-left-16 z-20 p-3 rounded-full bg-white/90 text-black hover:bg-black hover:text-white transition-colors border border-black/10 backdrop-blur-sm shadow-lg"
                data-hover="true"
                aria-label="Previous Artist"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); navigateArtist('next'); }}
                className="absolute -right-4 top-1/2 -translate-y-1/2 md:-right-16 z-20 p-3 rounded-full bg-white/90 text-black hover:bg-black hover:text-white transition-colors border border-black/10 backdrop-blur-sm shadow-lg"
                data-hover="true"
                aria-label="Next Artist"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image Side */}
              <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedArtist.id}
                    src={selectedArtist.image}
                    alt={selectedArtist.name}
                    loading="lazy"
                    decoding="async"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent md:bg-gradient-to-r" />
              </div>

              {/* Content Side */}
              <div className="w-full md:w-1/2 p-8 pb-24 md:p-12 flex flex-col justify-center relative">
                <motion.div
                  key={selectedArtist.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <div className="flex items-center gap-3 text-[#2d8a86] mb-4">
                    <Calendar className="w-4 h-4" />
                    <span className="font-mono text-sm tracking-widest uppercase">{selectedArtist.day}</span>
                  </div>

                  <h3 className="text-4xl md:text-6xl font-heading font-bold uppercase leading-none mb-2 text-black">
                    {selectedArtist.name}
                  </h3>

                  <p className="text-lg text-[#4fb7b3] font-medium tracking-widest uppercase mb-6">
                    {selectedArtist.genre}
                  </p>

                  <div className="h-px w-20 bg-black/10 mb-6" />

                  <div className="space-y-6 mb-8">
                    {selectedArtist.description.split(/\n{2,}/).map((para, idx) => {
                      const t = para.trim();
                      const indentClass = (t.startsWith('目标和解决方案') || t.startsWith('业务场景落地')) ? 'indent-0' : 'indent-[2em]';
                      return (
                        <p
                          key={idx}
                          className={`leading-relaxed text-lg whitespace-pre-wrap ${indentClass} text-black font-bold`}
                        >
                          {para}
                        </p>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Modals */}

      {/* Day Pass Modal */}
      <ContactModal
        isOpen={activeModal === 'day'}
        onClose={() => setActiveModal(null)}
        title="EMAIL"
        message="点击复制获取邮箱地址"
        contacts={[
          { label: 'Email Account', value: 'a861289009@gmail.com', type: 'email' }
        ]}
      />

      {/* Weekend Modal */}
      <ContactModal
        isOpen={activeModal === 'weekend'}
        onClose={() => setActiveModal(null)}
        title="Phone number"
        message="点击复制获取手机号码"
        color="teal"
        contacts={[
          { label: 'Phone Number', value: '13132007131', type: 'phone' }
        ]}
      />

      {/* Astral VIP Modal */}
      <ContactModal
        isOpen={activeModal === 'astral'}
        onClose={() => setActiveModal(null)}
        title="QQ/WECHAT"
        message="点击复制获取QQ或微信号码"
        color="periwinkle"
        contacts={[
          { label: 'QQ', value: '861289009', type: 'qq' },
          { label: 'WeChat', value: '13132007131', type: 'wechat' }
        ]}
      />
    </div>
  );
}

export default App;
