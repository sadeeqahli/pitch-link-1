import { useErrorStore, getErrorMessage, withErrorHandling, useLoadingStore } from '../utils/errorHandling';

describe('errorHandling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useErrorStore.getState().clearErrors();
    useLoadingStore.getState().clearLoading();
  });

  describe('useErrorStore', () => {
    it('should initialize with default values', () => {
      const state = useErrorStore.getState();
      
      expect(state.errors).toEqual([]);
      expect(state.isShowingError).toBe(false);
      expect(state.currentError).toBeNull();
    });

    it('should add an error', () => {
      const errorType = 'NETWORK';
      const errorMessage = 'Network error occurred';
      
      useErrorStore.getState().addError(errorType, errorMessage);
      
      const state = useErrorStore.getState();
      expect(state.errors).toHaveLength(1);
      expect(state.isShowingError).toBe(true);
      expect(state.currentError).toBeDefined();
      expect(state.currentError.type).toBe(errorType);
      expect(state.currentError.message).toBe(errorMessage);
    });

    it('should dismiss current error', () => {
      useErrorStore.getState().addError('NETWORK', 'Test error');
      useErrorStore.getState().dismissError();
      
      const state = useErrorStore.getState();
      expect(state.isShowingError).toBe(false);
      expect(state.currentError).toBeNull();
    });

    it('should clear all errors', () => {
      useErrorStore.getState().addError('NETWORK', 'Test error 1');
      useErrorStore.getState().addError('VALIDATION', 'Test error 2');
      useErrorStore.getState().clearErrors();
      
      const state = useErrorStore.getState();
      expect(state.errors).toEqual([]);
      expect(state.isShowingError).toBe(false);
      expect(state.currentError).toBeNull();
    });
  });

  describe('getErrorMessage', () => {
    it('should return user-friendly error messages', () => {
      const networkError = { type: 'NETWORK' };
      const validationError = { type: 'VALIDATION' };
      const authError = { type: 'AUTHENTICATION' };
      const bookingError = { type: 'BOOKING' };
      const paymentError = { type: 'PAYMENT' };
      const generalError = { type: 'GENERAL' };
      
      expect(getErrorMessage(networkError)).toBe('Please check your internet connection and try again.');
      expect(getErrorMessage(validationError)).toBe('Please check your input and try again.');
      expect(getErrorMessage(authError)).toBe('Please sign in again to continue.');
      expect(getErrorMessage(bookingError)).toBe('There was an issue with your booking. Please try again.');
      expect(getErrorMessage(paymentError)).toBe('Payment failed. Please check your payment method.');
      expect(getErrorMessage(generalError)).toBe('Something went wrong. Please try again.');
    });

    it('should return custom message if provided', () => {
      const error = { message: 'Custom error message' };
      expect(getErrorMessage(error)).toBe('Custom error message');
    });
  });

  describe('withErrorHandling', () => {
    it('should resolve successful operations', async () => {
      const operation = jest.fn().mockResolvedValue('success');
      
      const result = await withErrorHandling(operation);
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalled();
    });

    it('should handle network errors', async () => {
      const operation = jest.fn().mockRejectedValue(new Error('Network error'));
      const addErrorSpy = jest.spyOn(useErrorStore.getState(), 'addError');
      
      await expect(withErrorHandling(operation)).rejects.toThrow('Network error');
      expect(addErrorSpy).toHaveBeenCalledWith('NETWORK', 'Network connection failed', 'HIGH', expect.any(Object));
    });
  });

  describe('useLoadingStore', () => {
    it('should initialize with default values', () => {
      const state = useLoadingStore.getState();
      expect(state.loadingStates).toEqual({});
    });

    it('should set loading state', () => {
      useLoadingStore.getState().setLoading('testKey', true);
      
      const state = useLoadingStore.getState();
      expect(state.loadingStates.testKey).toBe(true);
    });

    it('should check if key is loading', () => {
      useLoadingStore.getState().setLoading('testKey', true);
      
      const isLoading = useLoadingStore.getState().isLoading('testKey');
      expect(isLoading).toBe(true);
    });

    it('should clear all loading states', () => {
      useLoadingStore.getState().setLoading('testKey1', true);
      useLoadingStore.getState().setLoading('testKey2', false);
      useLoadingStore.getState().clearLoading();
      
      const state = useLoadingStore.getState();
      expect(state.loadingStates).toEqual({});
    });
  });
});