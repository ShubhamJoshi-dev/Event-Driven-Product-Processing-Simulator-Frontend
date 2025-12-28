export interface FlowStep {
  id: string
  label: string
  status?: string
  active: boolean
}

export interface FlowDiagramProps {
  isActive: boolean
  onComplete: () => void
  onStepChange?: (step: number, stepName: string, description: string) => void
  manualControl?: boolean
  currentStep?: number
}

export interface StepInfo {
  step: number
  name: string
  description: string
}

