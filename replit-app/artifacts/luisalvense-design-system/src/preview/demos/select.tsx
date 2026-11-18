import { Select } from '../../components/ui/select';
import { Stack } from '../parts';

export function SelectDemo() {
  return (
    <div className="max-w-xl space-y-6 rounded-lg border bg-card p-5 text-card-foreground">
      <Stack label="Filtro de categoria">
        <Select defaultValue="all" aria-label="Categoria do catálogo">
          <option value="all">Todas as categorias</option>
          <option value="aves">Aves Temperadas</option>
          <option value="bovinos">Bovinos · sem osso</option>
          <option value="combos">Combos</option>
        </Select>
      </Stack>
      <Stack label="Estado desabilitado">
        <Select disabled defaultValue="all" aria-label="Filtro desabilitado">
          <option value="all">Todas as categorias</option>
        </Select>
      </Stack>
    </div>
  );
}
