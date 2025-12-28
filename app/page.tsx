'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import AddProductForm from '@/components/AddProductForm'
import FlowDiagram from '@/components/FlowDiagram'

interface ProductData {
  product_id: string
  product_name: string
  product_price: number
  product_description: string | number
  created_at: string
}

export default function Home() {
  const [isFlowActive, setIsFlowActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showDiagram, setShowDiagram] = useState(false)
  const [productData, setProductData] = useState<ProductData | null>(null)
  const [currentStepInfo, setCurrentStepInfo] = useState<{
    step: number
    name: string
    description: string
  } | null>(null)

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const extractProductId = (message: string): string | null => {
    const match = message.match(/Product ID: ([a-f0-9-]+)/i)
    return match ? match[1] : null
  }

  const handleFormSubmit = async (data: { name: string; price: string; details: string }) => {
    setIsLoading(true)
    setIsFlowActive(true)
    setShowSuccess(false)
    setCurrentStepInfo(null)
    setProductData(null)
    
    try {
      setCurrentStepInfo({ step: 0, name: 'User Request', description: 'User submits product data through the form. This triggers a POST request to the API endpoint.' })
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setCurrentStepInfo({ step: 1, name: 'API Gateway', description: 'API Gateway receives the HTTP request, validates it, and routes it to the appropriate backend service.' })
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      setCurrentStepInfo({ step: 2, name: 'Lambda Function (Processing)', description: 'Lambda function processes the request, validates the product data, and prepares it for asynchronous processing.' })
      
      const response = await fetch(`${API_BASE_URL}/product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_name: data.name,
          product_price: parseFloat(data.price),
          product_description: data.details,
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
      }

      setCurrentStepInfo({ step: 3, name: 'SQS Queue', description: 'SQS Queue stores the message temporarily, ensuring reliable delivery and decoupling the processing steps.' })
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const result = await response.text()
      const productId = extractProductId(result)

      setCurrentStepInfo({ step: 4, name: 'Lambda Function (Consumer)', description: 'Lambda function polls the SQS queue, retrieves the message, and processes the product data.' })
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (productId) {
        setCurrentStepInfo({ step: 5, name: 'DynamoDB', description: 'DynamoDB stores the product information persistently in a NoSQL database table.' })
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const getResponse = await fetch(`${API_BASE_URL}/product?product_id=${productId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (getResponse.ok) {
          const product = await getResponse.json()
          setProductData(product)
        }
      }

      setCurrentStepInfo({ step: 6, name: 'SNS Notification', description: 'SNS sends a notification to subscribers (email, SMS, etc.) confirming the product was successfully added.' })
      await new Promise(resolve => setTimeout(resolve, 1000))

      setIsLoading(false)
      setShowSuccess(true)
      setIsFlowActive(false)
    } catch (error) {
      console.error('Error submitting product:', error)
      setIsLoading(false)
      setIsFlowActive(false)
      alert('Failed to add product. Please try again.')
    }
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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showDiagram) {
        setShowDiagram(false)
      }
    }
    if (showDiagram) {
      window.addEventListener('keydown', handleEscape)
      return () => window.removeEventListener('keydown', handleEscape)
    }
  }, [showDiagram])

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
            Serverless Add Product Flow Simulator
          </h1>
        </motion.div>
        <motion.div
          className="flex justify-center mt-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.button
            onClick={() => setShowDiagram(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center gap-2 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="9" y1="3" x2="9" y2="21"/>
            </svg>
            Show Image Diagram
          </motion.button>
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
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleReset}
              >
                <motion.div
                  className="bg-gradient-to-br from-green-900/95 to-emerald-900/95 backdrop-blur-md border-2 border-green-500 rounded-2xl p-6 sm:p-8 shadow-2xl max-w-lg w-full mx-4 relative overflow-hidden"
                  initial={{ scale: 0.5, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-transparent to-green-500/20 animate-pulse"></div>
                  
                  <div className="relative z-10 text-center">
                    <motion.div
                      className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                      <motion.svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        <motion.path
                          d="M20 6L9 17l-5-5"
                          stroke="white"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                        />
                      </motion.svg>
                    </motion.div>
                    
                    <motion.h3
                      className="text-2xl font-bold text-white mb-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      Success!
                    </motion.h3>
                    
                    <motion.p
                      className="text-green-200 text-lg mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      Product is successfully added at DynamoDB
                    </motion.p>
                    
                    {productData && (
                      <motion.div
                        className="bg-slate-900/50 rounded-lg p-4 mb-6 border border-slate-700 text-left max-w-full"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <h4 className="text-white font-semibold mb-3 text-sm">Product Details:</h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex flex-col gap-1">
                            <span className="text-slate-400 text-xs">Product ID:</span>
                            <span className="text-green-300 font-mono text-xs break-all word-break break-all overflow-wrap break-word">{productData.product_id}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-slate-400 text-xs">Name:</span>
                            <span className="text-white break-words overflow-wrap break-word">{productData.product_name}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-slate-400 text-xs">Price:</span>
                            <span className="text-white">${productData.product_price}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-slate-400 text-xs">Description:</span>
                            <span className="text-white break-words overflow-wrap break-word">{productData.product_description}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-slate-400 text-xs">Created At:</span>
                            <span className="text-white text-xs break-words">{new Date(productData.created_at).toLocaleString()}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    <motion.button
                      onClick={handleReset}
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Close
                    </motion.button>
                  </div>
                  
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute w-full h-full border-2 border-green-400 rounded-2xl"
                      initial={{ scale: 1, opacity: 0.6 }}
                      animate={{
                        scale: [1, 1.1, 1.2],
                        opacity: [0.6, 0.3, 0],
                      }}
                      transition={{
                        delay: 0.6 + i * 0.3,
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeOut',
                      }}
                    />
                  ))}
                </motion.div>
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
                    manualControl={true}
                    currentStep={currentStepInfo?.step ?? 0}
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
                                    <div
                                      className={`w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center transition-all duration-300 ${
                                        isActive
                                          ? 'scale-110 shadow-lg shadow-blue-500/50'
                                          : isCompleted
                                          ? ''
                                          : 'opacity-50'
                                      }`}
                                    >
                                      <Image
                                        src={step.iconSrc}
                                        alt={step.name}
                                        width={32}
                                        height={32}
                                        className="object-contain"
                                      />
                                    </div>
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

      {showDiagram && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowDiagram(false)}
        >
          <motion.div
            className="relative bg-slate-900 rounded-2xl shadow-2xl max-w-6xl max-h-[90vh] mx-4 overflow-hidden border-2 border-blue-500/50"
            initial={{ scale: 0.7, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 50 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20"></div>
            
            <div className="relative z-10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <line x1="9" y1="3" x2="9" y2="21"/>
                  </svg>
                  AWS Serverless Architecture Diagram
                </h2>
                <motion.button
                  onClick={() => setShowDiagram(false)}
                  className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </motion.button>
              </div>
              
              <motion.div
                className="relative bg-slate-800 rounded-lg overflow-hidden border border-slate-700"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10 animate-pulse"></div>
                <div className="relative p-4 flex items-center justify-center max-h-[75vh] overflow-auto">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <Image
                      src="/flow.png"
                      alt="AWS Serverless Add Product Flow Diagram"
                      width={1200}
                      height={800}
                      className="rounded-lg shadow-xl"
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                  </motion.div>
                </div>
              </motion.div>
              
              <motion.div
                className="mt-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-slate-400 text-sm">
                  Click outside or press ESC to close
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </main>
  )
}

