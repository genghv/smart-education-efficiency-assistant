import type { ReactElement } from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import localFont from "next/font/local"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

// 添加自定义字体
const smileySans = localFont({
  src: "../fonts/SmileySans-Oblique.ttf",
  variable: "--font-smiley-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "国家中小学智慧教育平台智能助手 - 教师研修效率提升工具 | 暑期研修快速完成",
  description:
    "专为教师设计的智能效率工具，自动化处理国家中小学智慧教育平台任务、暑期研修和学分获取。支持视频课程自动播放、研修答题智能辅助、教育平台学习时长优化。每天节省3小时，让教师专注真正教学。",
  keywords: [
    "国家中小学智慧教育平台智能助手",
    "智慧教育平台自动化工具", 
    "国家中小学智慧教育平台",
    "暑期研修",
    "暑期研修快速完成",
    "暑期研修快速完成技巧",
    "暑期研修快速完成方案",
    "暑期研修快速完成工具",
    "暑期研修快速完成插件",
    "暑期研修快速完成浏览器扩展",
    "暑期研修快速完成浏览器插件",
    "视频加速",
    "视频加速工具",
    "视频加速插件",
    "视频加速浏览器扩展",
    "视频加速浏览器插件",
    "视频加速方案",
    "视频加速技巧",
    "教师继续教育",
    "教师研修效率提升工具",
    "教育任务智能辅助系统",
    "暑期研修快速完成技巧",
    "教师继续教育学分速通方案",
    "教学任务批量处理方法",
    "教育平台课时自动累积工具",
    "视频课程自动播放助手",
    "研修答题智能辅助工具",
    "教育平台学习时长优化",
    "教师发展学分管理神器",
    "教育平台合规增效工具",
    "教师减负合法辅助方案",
    "智慧教育平台TOC优化器",
    "研修任务效率提升插件",
    "如何快速完成国家平台暑期研修",
    "教师继续教育免挂机解决方案",
    "智慧教育平台任务自动化教程",
    "中小学教师学分积累效率工具",
    "教育平台AI智能辅助模块",
    "基于RPA的教学任务自动化",
    "智能教育工具开发框架",
    "教师研修浏览器扩展工具",
    "国家平台暑期研修",
    "教师继续教育",
    "智慧教育平台",
    "学分获取",
    "教学效率",
    "教育自动化"
  ].join(", "),
  authors: [{ name: "教育效率优化中心" }],
  creator: "教育效率优化中心",
  publisher: "教育效率优化中心",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://your-domain.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "国家中小学智慧教育平台智能助手 - 教师研修效率提升工具",
    description: "专为教师设计的智能效率工具，自动化处理国家中小学智慧教育平台任务、暑期研修和学分获取。支持视频课程自动播放、研修答题智能辅助。",
    url: 'https://your-domain.com',
    siteName: '教育效率助手',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '教育效率助手 - 智慧教育平台智能解决方案',
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "国家中小学智慧教育平台智能助手 - 教师研修效率提升工具",
    description: "专为教师设计的智能效率工具，自动化处理国家中小学智慧教育平台任务、暑期研修和学分获取。",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  generator: 'Next.js'
}

export default function RootLayout({
  children,
}: {
  children: ReactElement
}) {
  // 结构化数据
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "国家中小学智慧教育平台智能助手",
    "description": "专为教师设计的智能效率工具，自动化处理国家中小学智慧教育平台任务、暑期研修和学分获取",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "CNY"
    },
    "author": {
      "@type": "Organization",
      "name": "教育效率优化中心"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "10000"
    },
    "keywords": "国家中小学智慧教育平台,暑期研修,教师效率工具,学分获取,教育自动化"
  }

  return (
    <html lang="zh-CN" className={smileySans.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className={`${inter.className} font-sans`}>{children}</body>
    </html>
  )
}