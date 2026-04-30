import '@personal-okr/guitar/style.css';
import { Button } from '@personal-okr/guitar/button'

export default function App() {
  return (
    <div style={{ padding: '2rem', display: 'flex', gap: '.5rem' }}>
      <Button variant="neutral" />
      <Button variant="primary" />
    </div>
  )
}
