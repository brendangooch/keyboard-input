# keyboard-input

a class that listens for and processes keydown events on the document body before dispatching its own custom events for the client to listen for

simply drop the class into your project, turn it on, and tell it which custom events to dispatch

```typescript
const input = new KeyboardInput();
input.enable([
    'a-key-pressed',
    'ctrl-a-pressed',
    'ctrl-k-pressed',
    'left-key-pressed',
    'right-key-pressed',
    'shift-left-pressed',
    'shift-right-pressed',
    'spacebar-pressed',
    'enter-pressed'
]);
input.turnOn();
document.addEventListener('ctrl-a-pressed', () => console.log('you pressed Ctrl A'));
document.addEventListener('spacebar-pressed', () => console.log('you pressed the spacebar'));
// ...
```