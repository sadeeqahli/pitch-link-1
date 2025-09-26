declare module 'flutterwave-react-native' {
  import { ComponentType } from 'react';
  import { ViewStyle } from 'react-native';

  export interface FlutterwaveOptions {
    tx_ref: string;
    authorization?: string;
    customer: {
      email: string;
      phone_number?: string;
      name?: string;
    };
    amount: number;
    currency: string;
    payment_options?: string;
    redirect_url?: string;
    meta?: any;
    customizations: {
      title: string;
      description: string;
      logo: string;
    };
  }

  export interface FlutterwaveProps {
    onRedirect: (data: any) => void;
    options: FlutterwaveOptions;
    customButton?: ComponentType<any>;
    style?: ViewStyle;
  }

  const PayWithFlutterwave: ComponentType<FlutterwaveProps>;
  export default PayWithFlutterwave;
}