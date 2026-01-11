import { config } from '@repo/config'
import { Check, Database, Globe, Shield, Terminal } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const icons = {
  'CLI Running': Terminal,
  'Auth Ready': Shield,
  'Database Ready': Database,
  Deployed: Globe,
}

export function TimelineDemo() {
  const { timeline } = config.marketing
  const [currentStage, setCurrentStage] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  // Auto-play animation
  useEffect(() => {
    if (!isPlaying) {
      return
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsPlaying(false)
          return 100
        }
        return prev + 1
      })
    }, 15) // 100 steps * 15ms = 1.5 seconds total animation

    return () => clearInterval(interval)
  }, [isPlaying])

  // Update current stage based on progress
  useEffect(() => {
    const stageIndex = timeline.findIndex((stage, index) => {
      const nextStage = timeline[index + 1]
      const currentProgress = (progress / 100) * 60
      return currentProgress >= stage.time && (!nextStage || currentProgress < nextStage.time)
    })
    if (stageIndex !== -1) {
      setCurrentStage(stageIndex)
    }
  }, [progress, timeline])

  const getButtonText = () => {
    if (progress >= 100) {
      return 'Replay'
    }
    return isPlaying ? 'Pause' : 'Play Animation'
  }

  const handlePlayPause = () => {
    if (progress >= 100) {
      setProgress(0)
      setCurrentStage(0)
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-bold text-4xl tracking-tight">
            From Idea to Deployed in 60 Seconds
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Watch what happens when you run the CLI command. Everything is automated.
          </p>
        </div>

        {/* Timeline Visualization */}
        <Card className="mx-auto max-w-4xl p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium">Progress</span>
              <span className="font-mono text-muted-foreground">
                {Math.round((progress / 100) * 60)}s / 60s
              </span>
            </div>
            <div className="relative h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Timeline Stages */}
          <div className="mb-8 grid gap-6 sm:grid-cols-4">
            {timeline.map((stage, index) => {
              const Icon = icons[stage.label as keyof typeof icons]
              const isActive = index === currentStage
              const isCompleted = index < currentStage || progress >= 100

              const getStageClassName = () => {
                if (isCompleted) {
                  return 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                }
                if (isActive) {
                  return 'border-primary bg-primary/10 text-primary'
                }
                return 'border-muted bg-muted text-muted-foreground'
              }

              return (
                <div className="relative" key={stage.time}>
                  <div
                    className={`flex flex-col items-center text-center transition-all ${
                      isActive ? 'scale-110' : 'scale-100'
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`mb-3 flex size-16 items-center justify-center rounded-full border-2 transition-all ${getStageClassName()}`}
                    >
                      {isCompleted ? <Check className="size-8" /> : <Icon className="size-8" />}
                    </div>

                    {/* Time */}
                    <div className="mb-1 font-mono text-xs">{stage.time}s</div>

                    {/* Label */}
                    <div
                      className={`font-medium text-sm ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}
                    >
                      {stage.label}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Current Stage Details */}
          <div className="mb-6 rounded-lg bg-muted/50 p-6">
            <div className="mb-3 font-semibold">{timeline[currentStage].label}</div>
            <ul className="space-y-2 text-muted-foreground text-sm">
              {timeline[currentStage].details.map((detail) => (
                <li className="flex items-start gap-2" key={detail}>
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Play Button */}
          <div className="flex justify-center">
            <Button onClick={handlePlayPause} size="lg">
              {getButtonText()}
            </Button>
          </div>
        </Card>
      </div>
    </section>
  )
}
