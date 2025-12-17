import { Alert, Platform } from 'react-native';

if (Platform.OS === 'web') {
  // @ts-ignore
  Alert.alert = (title: string, message?: string, buttons?: any[], options?: any) => {
    const text = [title, message].filter(Boolean).join('\n');

    if (!buttons || buttons.length === 0) {
      window.alert(text);
      return;
    }

    // Check if it's a confirmation dialog
    // Logic: If there is a 'cancel' style button OR more than 1 button, treat as confirm
    const hasCancel = buttons.some(b => b.style === 'cancel');
    const isConfirm = buttons.length > 1 || hasCancel;

    if (isConfirm) {
      const result = window.confirm(text);
      if (result) {
        // User clicked OK/Yes
        // Find the button that is NOT cancel.
        // If multiple, we usually want the "positive" action.
        // We'll look for the one that isn't cancel.
        const confirmBtn = buttons.find(b => b.style !== 'cancel');
        confirmBtn?.onPress?.();
      } else {
        // User clicked Cancel
        const cancelBtn = buttons.find(b => b.style === 'cancel');
        // If no explicit cancel button but user cancelled, do nothing or find the first cancel button
        cancelBtn?.onPress?.();
      }
    } else {
      // Simple alert with one button (e.g. "OK")
      window.alert(text);
      buttons[0]?.onPress?.();
    }
  };
}
