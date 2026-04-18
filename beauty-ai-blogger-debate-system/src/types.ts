/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Blogger {
  id: string;
  name: string;
  avatar: string;
  description: string;
  tags: string[];
  preference: string;
  quote: string;
  type: 'value' | '成分' | 'budget' | 'effect' | 'gentle' | 'luxury' | 'local' | 'oily' | 'minimalist' | 'data';
}

export type Step = 'input' | 'knowledge' | 'focus' | 'matching' | 'debate' | 'result';

export interface DebateRound {
  round: number;
  speaker: string;
  content: string;
}

export interface Recommendation {
  primary: {
    name: string;
    brand: string;
    price: string;
    reason: string;
  };
  secondary?: {
    name: string;
    difference: string;
  };
  routine: {
    morning: string[];
    evening: string[];
  };
}
