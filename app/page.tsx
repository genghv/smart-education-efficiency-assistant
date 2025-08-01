"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { GraduationCap, Clock, Zap, Shield, Users, Star, CheckCircle, ArrowRight, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isLowPerformance, setIsLowPerformance] = useState(false)
  const { scrollYProgress } = useScroll()
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  
  // 性能检测
  useEffect(() => {
    // 检测设备性能
    const checkPerformance = () => {
      const start = performance.now()
      let sum = 0
      for (let i = 0; i < 1000000; i++) {
        sum += Math.random()
      }
      const end = performance.now()
      const duration = end - start
      
      // 如果计算时间超过50ms，认为是低性能设备
      if (duration > 50) {
        setIsLowPerformance(true)
      }
    }
    
    // 延迟检测，避免影响页面加载
    setTimeout(checkPerformance, 2000)
  }, [])
  
  // 智能倒计时系统
  const [displayNum, setDisplayNum] = useState(100)
  const [isRolling, setIsRolling] = useState(false)
  const animationRef = useRef<number | null>(null)
  const hasTriggeredRef = useRef(false) // 用于防止重复触发
  
  // 生成用户唯一ID，用于区分不同用户
  const [userId] = useState(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('userUniqueId')
      if (!id) {
        // 生成基于时间戳和随机数的唯一ID
        id = Date.now().toString(36) + Math.random().toString(36).substr(2)
        localStorage.setItem('userUniqueId', id)
      }
      return id
    }
    return 'default'
  })
  
  // 使用用户ID生成目标数字，确保每个用户都有不同的目标
  const [targetNum, setTargetNum] = useState(95) // 默认值
  
  // 记录用户每次看到的数字，确保只能减少
  const [lastSeenNum, setLastSeenNum] = useState(100) // 默认值
  
  // 记录上次触发动画的时间，用于控制动画频率
  const [lastAnimationTime, setLastAnimationTime] = useState(0)
  
  // 初始化用户相关的数据
  useEffect(() => {
    if (typeof window !== 'undefined' && userId) {
      // 初始化目标数字
      const targetKey = `targetNum_${userId}`
      const storedTarget = localStorage.getItem(targetKey)
      let currentTarget = 95 // 默认值
      
      if (storedTarget) {
        currentTarget = parseInt(storedTarget)
        setTargetNum(currentTarget)
      } else {
        // 基于用户ID生成90-99之间的伪随机数
        const hash = userId.split('').reduce((a, b) => {
          a = ((a << 5) - a) + b.charCodeAt(0)
          return a & a
        }, 0)
        currentTarget = 90 + Math.abs(hash) % 10
        localStorage.setItem(targetKey, currentTarget.toString())
        setTargetNum(currentTarget)
      }
      
      // 初始化显示数字 - 直接显示目标数字，不再减少
      const lastSeenKey = `lastSeenNum_${userId}`
      const storedLastSeen = localStorage.getItem(lastSeenKey)
      if (storedLastSeen) {
        const lastSeen = parseInt(storedLastSeen)
        setLastSeenNum(lastSeen)
        setDisplayNum(lastSeen) // 直接显示上次看到的数字
      } else {
        // 新用户，设置初始显示数字为目标数字
        setLastSeenNum(currentTarget)
        setDisplayNum(currentTarget)
        localStorage.setItem(lastSeenKey, currentTarget.toString())
      }
    }
  }, [userId])

  // 智能倒计时动画函数
  const startCountdownAnimation = () => {
    // 如果正在播放动画或已经触发过，则不重复触发
    if (isRolling || hasTriggeredRef.current) {
      return
    }
    
    // 检查动画频率，避免过于频繁触发
    const now = Date.now()
    if (now - lastAnimationTime < 3000) { // 3秒内不重复触发
      return
    }
    
    // 标记已触发，防止重复
    hasTriggeredRef.current = true
    setLastAnimationTime(now)
    
    // 动画逻辑：从100开始到目标数字，但目标数字不再减少
    const start = 100
    const end = targetNum // 直接使用目标数字，不再计算减少
    const duration = 2500
    const startTime = performance.now()
    let lastDisplayNum = start

    // 开始滚动
    setIsRolling(true)

    const step = (now: number) => {
      const elapsed = now - startTime
      const t = Math.min(elapsed / duration, 1)
      
      // 使用缓动函数
      const eased = t < 0.5 
        ? 2 * t * t 
        : 1 - Math.pow(-2 * t + 2, 3) / 2
      
      const current = Math.round(start - (start - end) * eased)
      
      if (current !== lastDisplayNum) {
        setDisplayNum(current)
        lastDisplayNum = current
      }
      
      if (t < 1) {
        animationRef.current = requestAnimationFrame(step)
      } else {
        // 动画结束
        setIsRolling(false)
        
        // 重置触发状态，允许下次进入时再次触发
        setTimeout(() => {
          hasTriggeredRef.current = false
        }, 1000)
      }
    }

    animationRef.current = requestAnimationFrame(step)
  }

  // 监听滚动到联系我们区域
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout
    
    const handleScroll = () => {
      // 清除之前的定时器，避免频繁触发
      clearTimeout(scrollTimeout)
      
      scrollTimeout = setTimeout(() => {
        const contactSection = document.getElementById('contact')
        if (contactSection) {
          const rect = contactSection.getBoundingClientRect()
          const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > window.innerHeight * 0.2
          
          if (isVisible) {
            startCountdownAnimation()
          }
        }
      }, 100) // 延迟100ms，避免滚动时频繁触发
    }

    // 添加滚动监听
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // 初始检查
    handleScroll()
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [lastSeenNum, targetNum])

  // 复制处理
  const handleCopy = () => {
    navigator.clipboard.writeText("shuxq00").then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 1500)
    }).catch(() => {
      // 失败也短暂提示（文案不可变，这里不改文本）
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 1500)
    })
  }

  useEffect(() => {
    setIsVisible(true)
    
    // 页面加载时不自动触发倒计时动画，只在滚动时触发
    // 这样可以避免重复播放
  }, [])

  const fadeInUp = {
    initial: { opacity: 0, y: isLowPerformance ? 20 : 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: isLowPerformance ? 0.4 : 0.8 },
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: isLowPerformance ? 0.05 : 0.1,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* 动态背景 */}
      {isLowPerformance ? (
        <div className="fixed inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.1),transparent_50%)]" />
        </div>
      ) : (
        <motion.div className="fixed inset-0 opacity-30" style={{ y: backgroundY }}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.1),transparent_50%)]" />
        </motion.div>
      )}

      {/* 导航栏 */}
      <motion.nav
        className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-white/20"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div className="flex items-center space-x-3" whileHover={{ scale: 1.05 }}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                智慧教育效率助手
              </span>
            </motion.div>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                首页
              </Link>
              {false && (
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                联系我们
              </Link>
              )}
              {false && (
              <Button 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              立即使用
            </Button>
            )}
            </div>

            <div className="flex flex-col items-center space-y-4 md:hidden">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                首页
              </Link>
              {false && (
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                联系我们
              </Link>
              )}
              {false && (
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl w-full">
                立即使用
              </Button>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* 英雄区域 */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: isLowPerformance ? 15 : 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: isLowPerformance ? 0.5 : 1, delay: 0.2 }}
          >
            <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200">✨ 10,000+ 教师的选择</Badge>
          </motion.div>

          <motion.h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight" {...fadeInUp}>
            <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
              让 ‘学分’ ’视频‘ 任务
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">轻松完成</span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            专为教师设计的国家中小学智慧教育平台智能助手，自动化处理暑期研修任务、视频课程播放、学分获取，
            <br className="hidden md:block" />
            支持教师继续教育效率提升，解放一整个暑假！！！
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-4"
              onClick={() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                // 重置触发状态，允许再次触发动画
                setTimeout(() => {
                  hasTriggeredRef.current = false
                }, 1000) // 延迟1秒重置，确保滚动完成
              }}
            >
              免费试用
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            {false && (
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-transparent">
              观看演示视频
              </Button>
             )}
          </motion.div>
        </div>
      </section>

      {/* 痛点分析 */}
      <section className="py-20 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              教师面临的真实挑战
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              我们深度调研了数千名一线教师，发现了这些普遍存在的问题
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Clock,
                title: "时间被占据",
                description: "智慧教育平台任务耗时过长，挤占业余时间",
                color: "from-red-500 to-pink-500",
              },
              {
                icon: Zap,
                title: "任务繁重",
                description: "暑期研修任务麻烦，多设备影响难控制且麻烦",
                color: "from-orange-500 to-yellow-500",
              },
              {
                icon: Shield,
                title: "学分焦虑",
                description: "担心学分不够，影响职业发展",
                color: "from-purple-500 to-indigo-500",
              },
              {
                icon: Users,
                title: "工作失衡",
                description: "无法兼顾家庭和个人提升",
                color: "from-blue-500 to-cyan-500",
              },
            ].map((item, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <div
                      className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center`}
                    >
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 解决方案 */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              我们的智能解决方案
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              经过2年深度研发，为教育工作者量身打造的智慧教育专业效率工具
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-8">
                {[
                  {
                    icon: Zap,
                    title: "极速完成智慧教育平台任务",
                    description: "智能化处理日常流程，30天工作量缩短至30分钟",
                  },
                  {
                    icon: GraduationCap,
                    title: "暑期研修轻松应对",
                    description: "自动化完成研修课程，让您真正享受假期时光",
                  },
                  {
                    icon: CheckCircle,
                    title: "学分无忧保障",
                    description: "确保及时完成所有学分要求，消除职业发展焦虑",
                  },
                  {
                    icon: Shield,
                    title: "安全合规操作",
                    description: "完全遵循平台规范，本地运行，账号安全无忧",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-8 text-white">
                <div className="text-center">
                  <div className="text-6xl font-bold mb-4">30min</div>
                  <div className="text-xl mb-8">即可开启暑期副本！！！</div>
                  <div className="grid grid-cols-2 gap-6 text-center">
                    <div>
                      <div className="text-3xl font-bold">10,000+</div>
                      <div className="text-blue-100">活跃用户</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">99.9%</div>
                      <div className="text-blue-100">成功率</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 用户评价 */}
      <section id="testimonials" className="py-20 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              10,000+ 教师的真实反馈
            </h2>
            <p className="text-xl text-gray-600">来自全国各地一线教师的使用体验分享</p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                name: "张老师",
                role: "市重点中学 | 8年教龄",
                content:
                  "这个工具彻底改变了我的工作方式！以前每天要花2小时刷平台任务，现在只需20-30分钟。省下的时间可以真正享受一下假期。",
                rating: 5,
              },
              {
                name: "李老师",
                role: "省级优秀教师 | 12年教龄",
                content:
                  "暑期终于可以真正休息了！自动化完成研修任务，不用再担心学分问题。这个工具是我们教育工作者的福音。",
                rating: 5,
              },
              {
                name: "王老师",
                role: "班主任 | 6年教龄",
                content:
                  "使用三次后，工作生活平衡明显改善。有更多时间陪伴家人，同时教学质量不降反升，领导都注意到我的变化。",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
                        {testimonial.name[0]}
                      </div>
                      <div className="min-h-[3rem] flex flex-col justify-center">
                        <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 联系我们 */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              立即开启暑期副本
            </h2>
            <p className="text-xl text-gray-600 mb-12">我们为前100位教师准备为期两年的免费服务</p>

            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-2xl">
              <CardContent className="p-12">
                {/* 优化布局：上下结构，微信号和二维码并排，倒计时居中 */}
                <div className="flex flex-col items-center space-y-8">
                  {/* 微信号和二维码并排显示 */}
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* 微信号信息 */}
                    <div className="flex flex-col items-center text-center">
                      <div className="flex items-center justify-center mb-4">
                        <MessageCircle className="w-16 h-16 text-green-500" />
                      </div>
                      <div className="text-2xl font-bold mb-4 text-gray-900">微信号：shuxq00</div>
                      <motion.div
                        whileHover={{ scale: 1.08, y: -2 }}
                        whileTap={{ scale: 0.92 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      >
                        <Button
                          size="lg"
                          className={`text-lg px-10 py-5 transition-all duration-200 shadow-xl hover:shadow-2xl ${isCopied ? 'bg-gray-400 from-gray-400 to-gray-500' : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'}`}
                          onClick={handleCopy}
                          aria-label="复制微信号"
                        >
                          {isCopied ? (
                            <>
                              <CheckCircle className="inline mr-2 w-5 h-5" /> 已复制
                            </>
                          ) : (
                            '复制微信号'
                          )}
                        </Button>
                      </motion.div>
                    </div>

                    {/* 二维码 */}
                    <div className="flex-shrink-0">
                      <motion.div 
                        className="relative w-[200px] h-[200px] rounded-3xl overflow-hidden bg-white shadow-2xl flex items-center justify-center border-4 border-green-200"
                        whileHover={{ scale: 1.08, rotate: 3, y: -5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 18 }}
                      >
                        <img
                          src="/wechat-qr.png"
                          alt="微信二维码"
                          className="object-contain w-full h-full p-2"
                        />
                      </motion.div>
                    </div>
                  </div>

                  {/* 倒计时居中显示，增加火爆特效 */}
                  <motion.div 
                    className="text-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.6 }}
                  >
                    <div className="text-red-600 font-bold text-2xl relative">
                      ⚡ 仅剩
                      <motion.span 
                        className={`inline-block min-w-[3ch] align-middle text-4xl font-black text-red-800 mx-2 relative ${isRolling ? 'animate-pulse' : ''}`}
                        key={`${displayNum}-${isRolling}`}
                        initial={{ scale: 1.3, y: -10, opacity: 0.6 }}
                        animate={{ 
                          scale: isRolling ? 1.15 : 1, 
                          y: 0, 
                          opacity: 1,
                          textShadow: isRolling ? "0 0 12px rgba(239, 68, 68, 0.8), 0 0 20px rgba(239, 68, 68, 0.4)" : "0 2px 4px rgba(0,0,0,0.1)"
                        }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 700, 
                          damping: 25,
                          duration: 0.3
                        }}
                      >
                        {displayNum}
                        {/* 添加火爆装饰 */}
                        {isRolling && (
                          <motion.div
                            className="absolute -top-2 -right-2 text-red-500 text-lg"
                            animate={{ 
                              scale: [1, 1.3, 1],
                              opacity: [0.6, 1, 0.6],
                              rotate: [0, 10, -10, 0]
                            }}
                            transition={{ 
                              duration: 1.2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            🔥
                          </motion.div>
                        )}
                      </motion.span>
                      个名额，
                      <motion.span
                        className="inline-block ml-2 font-bold"
                        animate={{ 
                          color: ["#dc2626", "#ef4444", "#dc2626"],
                          scale: [1, 1.05, 1]
                        }}
                        transition={{ 
                          duration: 1.8,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        立即行动！
                      </motion.span>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* SEO内容区域 - 对用户隐藏但对搜索引擎可见 */}
      <section className="sr-only">
        <h2>国家中小学智慧教育平台智能助手</h2>
        <p>国家中小学智慧教育平台智能助手是一款专为教师设计的效率工具，能够自动化处理智慧教育平台任务、暑期研修和学分获取。支持视频课程自动播放、研修答题智能辅助、教育平台学习时长优化等功能。</p>
        
        <h3>教师研修效率提升工具</h3>
        <p>我们的教师研修效率提升工具能够帮助教师快速完成国家平台暑期研修任务，提供教师继续教育学分速通方案，实现教学任务批量处理，支持教育平台课时自动累积。</p>
        
        <h3>教育任务智能辅助系统</h3>
        <p>教育任务智能辅助系统包含视频课程自动播放助手、研修答题智能辅助工具、教育平台学习时长优化、教师发展学分管理神器等核心功能。</p>
        
        <h3>教育平台合规增效工具</h3>
        <p>作为教育平台合规增效工具，我们提供教师减负合法辅助方案、智慧教育平台TOC优化器、研修任务效率提升插件等解决方案。</p>
        
        <h3>智能教育工具开发框架</h3>
        <p>基于RPA的教学任务自动化技术，结合教育平台AI智能辅助模块，为中小学教师提供学分积累效率工具，支持教师研修浏览器扩展工具开发。</p>
        
        <h3>如何快速完成国家平台暑期研修</h3>
        <p>了解如何快速完成国家平台暑期研修，掌握教师继续教育免挂机解决方案，学习智慧教育平台任务自动化教程，使用中小学教师学分积累效率工具。</p>
      </section>

      {/* 页脚 */}
      <footer className="py-12 px-6 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">教育效率助手</span>
          </div>
          <p className="text-gray-400 mb-8">© 2025 教育效率优化中心 - 专注服务一线教师</p>
          <div className="text-sm text-gray-500 max-w-4xl mx-auto">
            <p className="mb-4">
              <strong>免责声明：</strong>
              本工具旨在帮助教育工作者提高工作效率，优化工作流程。用户应确保其使用方式符合国家中小学智慧教育平台的相关规定和政策。
            </p>
            <p>本工具不存储任何平台账号密码，所有操作均在用户本地设备完成，确保信息安全。</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
