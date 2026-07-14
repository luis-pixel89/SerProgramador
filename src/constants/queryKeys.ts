export const QUERY_KEYS = {
  reservations: {
    all: ['reservations'] as const,
    list: () => [...QUERY_KEYS.reservations.all, 'list'] as const,
    detail: (id: string) => [...QUERY_KEYS.reservations.all, 'detail', id] as const,
    calendar: () => [...QUERY_KEYS.reservations.all, 'calendar'] as const,
  },
  campaign: {
    all: ['campaign'] as const,
    info: () => [...QUERY_KEYS.campaign.all, 'info'] as const,
  },
  advisors: {
    all: ['advisors'] as const,
    list: () => [...QUERY_KEYS.advisors.all, 'list'] as const,
  },
} as const
