
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Twitter, Linkedin, User, Sparkles } from 'lucide-react';
import GradientText from './GlitchText';
import { resolveImage } from '../assets/imageResolver';

const PersonalInfo: React.FC = () => {
  const personalData = {
    name: '王宇哲',
    role: 'AIGC designer',
    location: '期望城市：不限',
    bio: `软件技能：\n1.AIGC方面：包含开源1.5，XL，Flux模型以及自研3.0，4.0，视频模型的训练。熟练掌握comfy工作流制作，能使用python制作辅助生图、数据处理等脚本。会使用stable diffusion、midjourney、nano banana等AI平台。\n2.其他设计方面：掌握PS、AI、Figma等图像处理软件；掌握PR、剪映、DaVinci等视频处理软件；掌握Maya、Blender等3D建模、渲染软件；掌握Office、飞书等办公软件`,
    email: 'hello@lumina.festival',
    social: {
      twitter: 'https://x.com/GoogleAIStudio',
      linkedin: '#'
    },
    image: resolveImage('99.webp')
  };

  const stats = [
    { label: '工作时长', value: '2-3年' },
    { label: '承接项目', value: '30+' },
    { label: '服务客户', value: '50+' }
  ];

  return (
    <section id="curator" className="relative z-10 pt-20 md:pt-28 pb-8 md:pb-10 overflow-hidden">
      {/* Seamless Transition Background */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white/70 backdrop-blur-md -z-10"
        style={{ maskImage: 'linear-gradient(to bottom, transparent, black 20%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%)' }}
      />
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 right-[-10%] w-[40vw] h-[40vw] bg-[#4fb7b3]/10 rounded-full blur-[60px] pointer-events-none will-change-transform" />
      <div className="absolute bottom-1/4 left-[-10%] w-[35vw] h-[35vw] bg-[#637ab9]/10 rounded-full blur-[60px] pointer-events-none will-change-transform" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
        {/* Section Number & Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-8 md:mb-12 overflow-visible"
        >
          <div className="flex flex-col">
            <GradientText text="个人信息" as="span" className="text-3xl md:text-5xl leading-[1.4] top-[2px] font-heading font-bold font-black uppercase drop-shadow-xl" />
            <span className="text-base md:text-xl text-[#2d8a86] font-medium tracking-wide mt-[2px]">personal information</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: -30 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-5 order-1"
          >
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-br from-[#4fb7b3] via-[#637ab9] to-[#a8fbd3] rounded-3xl opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500" />

              {/* Image container */}
              <div className="relative h-[400px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={personalData.image}
                  loading="lazy"
                  decoding="async"
                  alt={personalData.name}
                  className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-105 will-change-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                
              </div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-7 order-2"
          >
            {/* Name & Role */}
            <div className="mb-5 md:mb-6">
              <h2 className="text-4xl md:text-7xl font-heading font-bold leading-tight flex items-baseline gap-3">
                <GradientText text={personalData.name} className="text-4xl md:text-7xl drop-shadow-xl" />
                <span className="text-base md:text-lg text-[#2d8a86] font-medium tracking-wide">{personalData.role}</span>
              </h2>
            </div>

            {/* Age */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-4 md:mb-5 text-black/80 leading-normal"
            >
              <User className="w-5 h-5" />
              <span className="text-base md:text-lg font-medium">年龄：24</span>
            </motion.div>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-4 md:mb-5 text-black/80 leading-normal"
            >
              <MapPin className="w-5 h-5" />
              <span className="text-base md:text-lg font-medium">{personalData.location}</span>
            </motion.div>

            {/* Job Status */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-4 md:mb-5 text-black/80 leading-normal"
            >
              <Sparkles className="w-5 h-5" />
              <span className="text-base md:text-lg font-medium">求职状态：在职 - 月内到岗</span>
            </motion.div>

            {/* Experience (moved below job status) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-4 md:mb-5"
            >
              <h3 className="text-base md:text-lg font-medium text-black mb-2 md:mb-3">工作经历</h3>
              <div className="space-y-2 md:space-y-3">
                <p className="text-base md:text-lg text-black/80 font-medium leading-normal">字节跳动-AIGC设计师-驻场-全职</p>
                <p className="text-base md:text-lg text-black/80 font-medium leading-normal">湖北峰达广告有限公司-视觉设计-全职-2023.07 - 2024.04</p>
              </div>
            </motion.div>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-base md:text-lg text-black/80 leading-normal mb-6 md:mb-8 font-medium whitespace-pre-line"
            >
              {personalData.bio}
            </motion.p>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
                  viewport={{ once: true }}
                  className="bg-white/60 backdrop-blur-md border border-black/10 rounded-2xl p-4 md:p-6 text-center hover:border-[#4fb7b3]/30 transition-colors duration-300"
                  data-hover="true"
                >
                  <div className="text-2xl md:text-4xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#2d8a86] to-[#435585] mb-1 md:mb-2">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-black/60 font-medium uppercase tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>



          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PersonalInfo;
