"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MessageCircle, Mail, ArrowLeft, Copy, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function ContactPage() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      alert(`复制失败，请手动复制：${text}`)
    }
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* 动态背景 */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.1),transparent_50%)]" />
      </div>

      {/* 导航栏 */}
      <motion.nav
        className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-white/20"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 hover:scale-105 transition-transform">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                联系我们
              </span>
            </Link>

            <Link href="/">
              <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                <ArrowLeft className="w-4 h-4" />
                <span>返回首页</span>
              </Button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* 主要内容 */}
      <div className="relative pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              联系我们
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">获取使用方式，享受一对一专业支持服务</p>
          </motion.div>

          <motion.div
            className="grid gap-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* 微信联系 */}
            <Card className="hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                      <MessageCircle className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">微信客服（推荐）</h3>
                      <p className="text-gray-600 mb-3">快速响应，专业解答</p>
                      <div className="text-xl font-mono font-bold text-green-600">1739839461</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-xl flex items-center justify-center">
                      <img
                        src="/placeholder.svg?height=96&width=96&text=微信二维码"
                        alt="微信二维码"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <Button
                      onClick={() => copyToClipboard("1739839461", "wechat")}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      {copied === "wechat" ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          已复制
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          复制微信号
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* QQ联系 */}
            <Card className="hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                      <MessageCircle className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">QQ 客服</h3>
                      <p className="text-gray-600 mb-3">在线咨询，即时沟通</p>
                      <div className="text-xl font-mono font-bold text-blue-600">1739839461</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-xl flex items-center justify-center">
                      <img
                        src="/placeholder.svg?height=96&width=96&text=QQ二维码"
                        alt="QQ二维码"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <Button onClick={() => copyToClipboard("1739839461", "qq")} variant="outline">
                      {copied === "qq" ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          已复制
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          复制QQ号
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 邮件联系 */}
            <Card className="hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                      <Mail className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">邮件联系</h3>
                      <p className="text-gray-600 mb-3">详细咨询，专业回复</p>
                      <div className="text-xl font-mono font-bold text-purple-600">gengxberqiu@qq.com</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center space-y-4">
                    <Button onClick={() => copyToClipboard("gengxberqiu@qq.com", "email")} variant="outline">
                      {copied === "email" ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          已复制
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          复制邮箱
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 服务承诺 */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">我们的服务承诺</h3>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">24小时</div>
                    <div className="text-gray-600">快速响应</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600 mb-2">1对1</div>
                    <div className="text-gray-600">专业指导</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600 mb-2">终身</div>
                    <div className="text-gray-600">技术支持</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
