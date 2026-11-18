import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Stack } from '../parts';

export function InputDemo() {
  const [focused, setFocused] = useState(false);
  return (
    <div className="max-w-2xl space-y-6 rounded-lg border bg-card p-5 text-card-foreground">
      <Stack label="Busca do catálogo">
        <label className="flex items-center gap-2 rounded-sm border border-input bg-card px-2.5 text-muted-foreground focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/25">
          <Search size={16} aria-hidden="true" />
          <Input className="border-0 px-0 focus-visible:ring-0" placeholder="Buscar produto ou categoria" />
        </label>
      </Stack>
      <Stack label={focused ? 'Foco ativo' : 'Campo de edição'}>
        <Input
          value="Coração de Frango"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-label="Nome do produto"
        />
        <Input disabled placeholder="Campo desabilitado" aria-label="Campo desabilitado" />
      </Stack>
    </div>
  );
}
