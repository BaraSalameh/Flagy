'use client';

import { Provider } from 'react-redux';
import  store  from '@/lib/store/store';

export const ReduxProvider = ({ children }: { children: React.ReactNode; }) => <Provider store={store}>{children}</Provider>;