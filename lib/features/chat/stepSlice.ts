import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Step, StepExecution } from '@/lib/types'

interface StepState {
  executions: StepExecution[]
  currentExecution: string | null
}

const initialState: StepState = {
  executions: [],
  currentExecution: null,
}

export const stepSlice = createSlice({
  name: 'steps',
  initialState,
  reducers: {
    startExecution: (state, action: PayloadAction<{ messageId: string; steps: Omit<Step, 'id' | 'status' | 'progress'>[] }>) => {
      const execution: StepExecution = {
        id: Date.now().toString(),
        messageId: action.payload.messageId,
        steps: action.payload.steps.map((step, index) => ({
          ...step,
          id: `${Date.now()}-${index}`,
          status: 'pending',
          progress: 0,
        })),
        currentStepIndex: 0,
        isRunning: true,
      }
      state.executions.push(execution)
      state.currentExecution = execution.id
    },
    updateStepStatus: (state, action: PayloadAction<{ executionId: string; stepId: string; status: Step['status']; progress?: number; result?: unknown; error?: string }>) => {
      const execution = state.executions.find(e => e.id === action.payload.executionId)
      if (execution) {
        const step = execution.steps.find(s => s.id === action.payload.stepId)
        if (step) {
          step.status = action.payload.status
          if (action.payload.progress !== undefined) step.progress = action.payload.progress
          if (action.payload.result !== undefined) step.result = action.payload.result
          if (action.payload.error !== undefined) step.error = action.payload.error
        }
      }
    },
    nextStep: (state, action: PayloadAction<string>) => {
      const execution = state.executions.find(e => e.id === action.payload)
      if (execution && execution.currentStepIndex < execution.steps.length - 1) {
        execution.currentStepIndex += 1
      }
    },
    completeExecution: (state, action: PayloadAction<string>) => {
      const execution = state.executions.find(e => e.id === action.payload)
      if (execution) {
        execution.isRunning = false
      }
      if (state.currentExecution === action.payload) {
        state.currentExecution = null
      }
    },
  },
})

export const { startExecution, updateStepStatus, nextStep, completeExecution } = stepSlice.actions
export default stepSlice.reducer