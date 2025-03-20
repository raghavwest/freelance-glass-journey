
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Job } from "@/components/FreelanceApp";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculatePriorityScore(job: Job): number {
  // Get days until deadline
  const today = new Date();
  const deadline = new Date(job.deadline);
  const daysUntilDeadline = Math.max(1, Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  
  // Parse pay amount - strip currency symbols and convert to number
  const payAmount = parseFloat(job.discussedPay.replace(/[^0-9.]/g, '')) || 0;
  
  // Urgency score (inversely proportional to days until deadline)
  // More urgent jobs (closer deadline) get higher scores
  const urgencyFactor = 100 / daysUntilDeadline;
  
  // Pay score (directly proportional to pay amount)
  // Higher paying jobs get higher scores
  const payFactor = Math.min(100, payAmount / 100);
  
  // Calculate weighted score
  // 60% weight on urgency, 40% weight on pay
  const priorityScore = (urgencyFactor * 0.6) + (payFactor * 0.4);
  
  return priorityScore;
}
