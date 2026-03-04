export const PLAN_LIMITS: Record<string, { credits: number; token_limit: number }> = {
    'free': { credits: 100, token_limit: 50000 },
    'Hobby': { credits: 100, token_limit: 50000 },
    'Basic': { credits: 17000, token_limit: 1000000 },
    'Personal': { credits: 37000, token_limit: 5000000 },
    'Business': { credits: 81000, token_limit: 20000000 },
}
