'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import AddProductForm from '@/components/AddProductForm'
import FlowDiagram from '@/components/FlowDiagram'

export default function Home() {
  const [isFlowActive, setIsFlowActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [currentStepInfo, setCurrentStepInfo] = useState<{
    step: number
    name: string
    description: string
  } | null>(null)

  const handleFormSubmit = async (data: { name: string; price: string; details: string }) => {
    setIsLoading(true)
    setIsFlowActive(true)
    setShowSuccess(false)
    setCurrentStepInfo(null)
    
    setTimeout(() => {
      setIsLoading(false)
    }, 12000)
  }

  const handleFlowComplete = () => {
    setShowSuccess(true)
    setIsFlowActive(false)
  }

  const handleReset = () => {
    setIsFlowActive(false)
    setIsLoading(false)
    setShowSuccess(false)
    setCurrentStepInfo(null)
  }

  const handleStepChange = useCallback((step: number, stepName: string, description: string) => {
    setCurrentStepInfo({ step, name: stepName, description })
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      <header className="relative z-10 pt-8 pb-4">
        <motion.div
          className="flex items-center justify-center gap-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="#FF9900"
            className="drop-shadow-lg"
          >
            <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18l8 4v8.64l-8 4-8-4V8.18l8-4z" />
          </svg>
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">
            Serverless Order Flow Simulator
          </h1>
        </motion.div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="w-full max-w-md mb-8">
            <AddProductForm onSubmit={handleFormSubmit} isLoading={isLoading} />
            
            {(isFlowActive || showSuccess) && (
              <motion.button
                onClick={handleReset}
                className="mt-4 w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Reset Flow
              </motion.button>
            )}

            {showSuccess && (
              <motion.div
                className="mt-4 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-400 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                ✓ Product added successfully!
              </motion.div>
            )}
          </div>

          <div className="w-full max-w-7xl">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <motion.div
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 shadow-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h2 className="text-xl font-semibold text-white mb-6 text-center">
                    AWS Serverless Flow
                  </h2>
                  <FlowDiagram 
                    isActive={isFlowActive} 
                    onComplete={handleFlowComplete}
                    onStepChange={handleStepChange}
                  />
                </motion.div>
              </div>

              {isFlowActive && (
                <motion.div
                  className="lg:w-80 flex-shrink-0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-gradient-to-br from-blue-900/90 to-purple-900/90 backdrop-blur-sm border border-blue-500/50 rounded-xl p-6 shadow-xl h-full">
                    {currentStepInfo && (
                      <>
                        <div className="flex items-start gap-4 mb-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {currentStepInfo.step + 1}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-semibold text-xl mb-2">
                              {currentStepInfo.name}
                            </h3>
                          </div>
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 mb-6">
                          <p className="text-slate-200 text-sm leading-relaxed">
                            {currentStepInfo.description}
                          </p>
                        </div>
                      </>
                    )}

                    <div className="mb-6">
                      <h4 className="text-white font-semibold text-sm mb-3">Flow Steps</h4>
                      <div className="space-y-2">
                        {[
                          { id: 0, name: 'User', iconSrc: null },
                          { id: 1, name: 'API Gateway', iconSrc: '/images/amazon_api_gateway.jpeg' },
                          { id: 2, name: 'Lambda', iconSrc: '/images/amazon_lambda.png' },
                          { id: 3, name: 'SQS', iconSrc: '/images/amazon_sqs.png' },
                          { id: 4, name: 'Lambda', iconSrc: '/images/amazon_lambda.png' },
                          { id: 5, name: 'DynamoDB', iconSrc: '/images/amazon_dynamo_db.jpeg' },
                          { id: 6, name: 'SNS', iconSrc: '/images/amazon_sns.jpeg' },
                        ].map((step, index) => {
                          const isActive = currentStepInfo && currentStepInfo.step === step.id
                          const isCompleted = currentStepInfo && currentStepInfo.step > step.id
                          
                          return (
                            <div key={step.id} className="relative">
                              {index > 0 && (
                                <div className="absolute left-5 -top-2 w-0.5 h-4 overflow-hidden">
                                  <motion.div
                                    className={`w-full h-full ${
                                      isCompleted || isActive
                                        ? 'bg-gradient-to-b from-blue-500 to-purple-500'
                                        : 'bg-slate-700'
                                    }`}
                                    initial={{ height: '0%' }}
                                    animate={{
                                      height: isCompleted || isActive ? '100%' : '0%',
                                    }}
                                    transition={{ duration: 0.5, ease: 'easeOut' }}
                                  />
                                </div>
                              )}
                              
                              <div
                                className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-300 ${
                                  isActive
                                    ? 'bg-blue-500/20 border border-blue-500/50'
                                    : isCompleted
                                    ? 'bg-green-500/10 border border-green-500/30'
                                    : 'bg-slate-800/50 border border-slate-700'
                                }`}
                              >
                                <div className="relative">
                                  {step.iconSrc ? (
                                    <motion.div
                                      className={`w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center transition-all duration-300 ${
                                        isActive
                                          ? 'scale-110'
                                          : isCompleted
                                          ? ''
                                          : 'opacity-50'
                                      }`}
                                      animate={
                                        isActive
                                          ? {
                                              boxShadow: [
                                                '0 0 0 0 rgba(59, 130, 246, 0.5)',
                                                '0 0 15px 5px rgba(59, 130, 246, 0.8)',
                                                '0 0 0 0 rgba(59, 130, 246, 0.5)',
                                              ],
                                            }
                                          : {}
                                      }
                                      transition={{
                                        duration: 1.5,
                                        repeat: isActive ? Infinity : 0,
                                        ease: 'easeInOut',
                                      }}
                                    >
                                      <Image
                                        src={step.iconSrc}
                                        alt={step.name}
                                        width={32}
                                        height={32}
                                        className="object-contain"
                                      />
                                    </motion.div>
                                  ) : (
                                    <div
                                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-300 ${
                                        isActive
                                          ? 'bg-blue-500 text-white scale-110'
                                          : isCompleted
                                          ? 'bg-green-500 text-white'
                                          : 'bg-slate-700 text-slate-400'
                                      }`}
                                    >
                                      {isCompleted ? '✓' : '👤'}
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div
                                    className={`text-xs font-medium ${
                                      isActive
                                        ? 'text-blue-300'
                                        : isCompleted
                                        ? 'text-green-300'
                                        : 'text-slate-400'
                                    }`}
                                  >
                                    {step.name}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-2">
                        <span>Overall Progress</span>
                        <span>
                          {currentStepInfo
                            ? Math.min(Math.round(((currentStepInfo.step + 1) / 7) * 100), 100)
                            : 0}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
                        <motion.div
                          className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-full rounded-full"
                          initial={{ width: '0%' }}
                          animate={{
                            width: currentStepInfo
                              ? `${Math.min(((currentStepInfo.step + 1) / 7) * 100, 100)}%`
                              : '0%',
                          }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                        />
                      </div>
                      {!currentStepInfo && (
                        <div className="mt-2 text-xs text-slate-500 text-center">
                          Waiting for flow to start...
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="relative z-10 text-center text-slate-400 text-sm py-4">
        <p>Simulation only - No real AWS calls are made</p>
      </footer>
    </main>
  )
}

