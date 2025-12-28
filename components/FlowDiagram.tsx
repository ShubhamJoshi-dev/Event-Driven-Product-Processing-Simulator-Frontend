'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AwsNode from './AwsNode'
import AnimatedEdge from './AnimatedEdge'

interface FlowStep {
  id: string
  label: string
  status?: string
  active: boolean
}

interface FlowDiagramProps {
  isActive: boolean
  onComplete: () => void
  onStepChange?: (step: number, stepName: string, description: string) => void
}

export default function FlowDiagram({ isActive, onComplete, onStepChange }: FlowDiagramProps) {
  const [currentStep, setCurrentStep] = useState<number>(0)

  const nodePositions = {
    user: { x: 400, y: 100 },
    apiGateway: { x: 400, y: 300 },
    lambda1: { x: 200, y: 480 },
    sqs: { x: 400, y: 660 },
    lambda2: { x: 600, y: 480 },
    dynamodb: { x: 600, y: 720 },
    sns: { x: 400, y: 860 },
  }

  const stepDescriptions: Record<string, string> = {
    user: 'User submits product data through the form. This triggers a POST request to the API endpoint.',
    apiGateway: 'API Gateway receives the HTTP request, validates it, and routes it to the appropriate backend service.',
    lambda1: 'Lambda function processes the request, validates the product data, and prepares it for asynchronous processing.',
    sqs: 'SQS Queue stores the message temporarily, ensuring reliable delivery and decoupling the processing steps.',
    lambda2: 'Lambda function polls the SQS queue, retrieves the message, and processes the product data.',
    dynamodb: 'DynamoDB stores the product information persistently in a NoSQL database table.',
    sns: 'SNS sends a notification to subscribers (email, SMS, etc.) confirming the product was successfully added.',
  }

  const edgeDescriptions: Record<string, string> = {
    'user-apiGateway': 'HTTP POST Request',
    'apiGateway-lambda1': 'Invoke Function',
    'lambda1-sqs': 'Publish Message',
    'sqs-lambda2': 'Poll Queue',
    'lambda2-dynamodb': 'Write Data',
    'dynamodb-sns': 'Send Notification',
  }

  const steps: FlowStep[] = [
    { id: 'user', label: 'User', status: 'POST /api/products', active: false },
    { id: 'apiGateway', label: 'API Gateway', status: 'Request received', active: false },
    { id: 'lambda1', label: 'Lambda Function', status: 'Lambda invoked', active: false },
    { id: 'sqs', label: 'SQS Queue', status: 'Message published to SQS', active: false },
    { id: 'lambda2', label: 'Lambda Function', status: 'Processing message', active: false },
    { id: 'dynamodb', label: 'DynamoDB', status: 'Data stored', active: false },
    { id: 'sns', label: 'SNS Notification', status: 'Product added successfully – notification sent', active: false },
  ]

  const getCurrentStepDescription = () => {
    if (currentStep === 0 && isActive) return stepDescriptions['user']
    if (currentStep === 1) return stepDescriptions['apiGateway']
    if (currentStep === 2) return stepDescriptions['lambda1']
    if (currentStep === 3) return stepDescriptions['sqs']
    if (currentStep === 4) return stepDescriptions['lambda2']
    if (currentStep === 5) return stepDescriptions['dynamodb']
    if (currentStep === 6) return stepDescriptions['sns']
    return null
  }

  const getCurrentStepName = () => {
    if (currentStep === 0 && isActive) return 'User Request'
    if (currentStep === 1) return 'API Gateway'
    if (currentStep === 2) return 'Lambda Function (Processing)'
    if (currentStep === 3) return 'SQS Queue'
    if (currentStep === 4) return 'Lambda Function (Consumer)'
    if (currentStep === 5) return 'DynamoDB'
    if (currentStep === 6) return 'SNS Notification'
    return 'Ready'
  }

  useEffect(() => {
    if (!isActive) {
      setCurrentStep(0)
      return
    }

    const timers: NodeJS.Timeout[] = []
    
    const stepConfig = [
      { delay: 0, step: 0, name: 'User Request', desc: 'user' },
      { delay: 800, step: 1, name: 'API Gateway', desc: 'apiGateway' },
      { delay: 2000, step: 2, name: 'Lambda Function (Processing)', desc: 'lambda1' },
      { delay: 3500, step: 3, name: 'SQS Queue', desc: 'sqs' },
      { delay: 5500, step: 4, name: 'Lambda Function (Consumer)', desc: 'lambda2' },
      { delay: 6500, step: 5, name: 'DynamoDB', desc: 'dynamodb' },
      { delay: 7500, step: 6, name: 'SNS Notification', desc: 'sns' },
    ]
    
    stepConfig.forEach(({ delay, step, name, desc }) => {
      const timer = setTimeout(() => {
        setCurrentStep(step)
        if (onStepChange && stepDescriptions[desc]) {
          onStepChange(step, name, stepDescriptions[desc])
        }
      }, delay)
      timers.push(timer)
    })
    
    const completionTimer = setTimeout(() => {
      if (onComplete) {
        onComplete()
      }
    }, 9000)
    timers.push(completionTimer)
    
    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [isActive])

  const getNodeStatus = (stepId: string) => {
    const stepIndex = steps.findIndex(s => s.id === stepId)
    if (stepIndex === -1) return undefined
    if (currentStep > stepIndex) return steps[stepIndex].status
    return undefined
  }

  const isNodeActive = (stepId: string) => {
    const stepIndex = steps.findIndex(s => s.id === stepId)
    return currentStep > stepIndex
  }

  return (
    <div className="relative w-full h-full min-h-[950px]">
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
      >
        <AnimatedEdge
          x1={nodePositions.user.x}
          y1={nodePositions.user.y}
          x2={nodePositions.apiGateway.x}
          y2={nodePositions.apiGateway.y}
          isActive={isActive && currentStep >= 1}
          delay={0}
        />

        <AnimatedEdge
          x1={nodePositions.apiGateway.x}
          y1={nodePositions.apiGateway.y}
          x2={nodePositions.lambda1.x}
          y2={nodePositions.lambda1.y}
          isActive={isActive && currentStep >= 2}
          delay={800}
        />

        <AnimatedEdge
          x1={nodePositions.lambda1.x}
          y1={nodePositions.lambda1.y}
          x2={nodePositions.sqs.x}
          y2={nodePositions.sqs.y}
          isActive={isActive && currentStep >= 3}
          delay={2000}
        />

        <AnimatedEdge
          x1={nodePositions.sqs.x}
          y1={nodePositions.sqs.y}
          x2={nodePositions.lambda2.x}
          y2={nodePositions.lambda2.y}
          isActive={isActive && currentStep >= 4}
          delay={5500}
        />

        <AnimatedEdge
          x1={nodePositions.lambda2.x}
          y1={nodePositions.lambda2.y}
          x2={nodePositions.dynamodb.x}
          y2={nodePositions.dynamodb.y}
          isActive={isActive && currentStep >= 5}
          delay={6500}
        />

        <AnimatedEdge
          x1={nodePositions.dynamodb.x}
          y1={nodePositions.dynamodb.y}
          x2={nodePositions.sns.x}
          y2={nodePositions.sns.y}
          isActive={isActive && currentStep >= 6}
          delay={7500}
        />
      </svg>
      <motion.div
        className="absolute"
        style={{
          left: nodePositions.user.x,
          top: nodePositions.user.y,
          transform: 'translate(-50%, -50%)',
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className={`
            relative bg-slate-800 border-2 rounded-lg p-4 min-w-[180px]
            shadow-lg backdrop-blur-sm
            ${isNodeActive('user') ? 'border-blue-500' : 'border-slate-600'}
          `}
          animate={{
            boxShadow: isNodeActive('user')
              ? [
                  '0 0 0 0 rgba(59, 130, 246, 0.5)',
                  '0 0 20px 5px rgba(59, 130, 246, 0.5)',
                  '0 0 0 0 rgba(59, 130, 246, 0.5)',
                ]
              : '0 4px 6px rgba(0, 0, 0, 0.3)',
          }}
          transition={{
            duration: 1.5,
            repeat: isNodeActive('user') ? Infinity : 0,
            ease: 'easeInOut',
          }}
        >
          <div className="flex items-center justify-center mb-2">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="4" stroke="#3B82F6" strokeWidth="2" fill="none"/>
              <path d="M6 21c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="#3B82F6" strokeWidth="2" fill="none"/>
            </svg>
          </div>

          <div className="text-center text-sm font-semibold text-white mb-1">
            User
          </div>

          {getNodeStatus('user') && (
            <motion.div
              className="text-center text-xs text-blue-400 mt-1 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {getNodeStatus('user')}
            </motion.div>
          )}

          {stepDescriptions['user'] && isNodeActive('user') && (
            <motion.div
              className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-slate-900 border border-slate-600 rounded-lg p-3 shadow-xl z-10"
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-xs text-slate-300 leading-relaxed">
                {stepDescriptions['user']}
              </div>
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-slate-900 border-l border-t border-slate-600 rotate-45"></div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      <AwsNode
        id="apiGateway"
        label="API Gateway"
        iconSrc="/images/amazon_api_gateway.jpeg"
        iconAlt="API Gateway"
        x={nodePositions.apiGateway.x}
        y={nodePositions.apiGateway.y}
        isActive={isNodeActive('apiGateway')}
        status={getNodeStatus('apiGateway')}
      />

      <AwsNode
        id="lambda1"
        label="Lambda Function"
        iconSrc="/images/amazon_lambda.png"
        iconAlt="Lambda Function"
        x={nodePositions.lambda1.x}
        y={nodePositions.lambda1.y}
        isActive={isNodeActive('lambda1')}
        status={getNodeStatus('lambda1')}
      />

      <AwsNode
        id="sqs"
        label="SQS Queue"
        iconSrc="/images/amazon_sqs.png"
        iconAlt="SQS Queue"
        x={nodePositions.sqs.x}
        y={nodePositions.sqs.y}
        isActive={isNodeActive('sqs')}
        status={getNodeStatus('sqs')}
      />

      <AwsNode
        id="lambda2"
        label="Lambda Function"
        iconSrc="/images/amazon_lambda.png"
        iconAlt="Lambda Function"
        x={nodePositions.lambda2.x}
        y={nodePositions.lambda2.y}
        isActive={isNodeActive('lambda2')}
        status={getNodeStatus('lambda2')}
      />

      <AwsNode
        id="dynamodb"
        label="DynamoDB"
        iconSrc="/images/amazon_dynamo_db.jpeg"
        iconAlt="DynamoDB"
        x={nodePositions.dynamodb.x}
        y={nodePositions.dynamodb.y}
        isActive={isNodeActive('dynamodb')}
        status={getNodeStatus('dynamodb')}
      />

      <AwsNode
        id="sns"
        label="SNS Notification"
        iconSrc="/images/amazon_sns.jpeg"
        iconAlt="SNS Notification"
        x={nodePositions.sns.x}
        y={nodePositions.sns.y}
        isActive={isNodeActive('sns')}
        status={getNodeStatus('sns')}
        glowColor="rgba(255, 215, 0, 0.8)"
      />

      {isNodeActive('sqs') && (
        <motion.div
          className="absolute"
          style={{
            left: nodePositions.sqs.x - 90,
            top: nodePositions.sqs.y - 20,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-4 h-4 bg-aws-orange rounded mb-1"
              initial={{ y: -20, opacity: 0 }}
              animate={{
                y: i * 8,
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                delay: 3.5 + i * 0.3,
                duration: 0.5,
                repeat: currentStep >= 3 && currentStep < 4 ? Infinity : 0,
              }}
            />
          ))}
        </motion.div>
      )}

      {isNodeActive('dynamodb') && currentStep === 5 && (
        <motion.div
          className="absolute"
          style={{
            left: nodePositions.dynamodb.x + 100,
            top: nodePositions.dynamodb.y - 30,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-16 h-2 bg-green-500 rounded mb-1"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                delay: i * 0.2,
                duration: 0.3,
              }}
            />
          ))}
        </motion.div>
      )}

      {isNodeActive('sns') && currentStep === 6 && (
        <motion.div
          className="absolute"
          style={{
            left: nodePositions.sns.x,
            top: nodePositions.sns.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-32 border-2 border-yellow-400 rounded-full"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ scale: 0.5, opacity: 0.6 }}
              animate={{
                scale: [1, 1.8],
                opacity: [0.6, 0],
              }}
              transition={{
                delay: i * 0.4,
                duration: 1,
                repeat: Infinity,
                repeatDelay: 0.5,
                ease: 'easeOut',
              }}
            />
          ))}
        </motion.div>
      )}
    </div>
  )
}

