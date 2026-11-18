import { Button } from '../../components/ui/button';
import { Row } from '../parts';

export function ButtonDemo() {
  return (
    <div className="space-y-6 rounded-lg border bg-card p-5 text-card-foreground">
      <Row label="Ações do catálogo">
        <Button>Salvar produto</Button>
        <Button variant="outline">Cancelar</Button>
        <Button variant="selected" aria-pressed="true">Selecionado</Button>
        <Button variant="ghost">Editar</Button>
      </Row>
      <Row label="Tamanhos">
        <Button size="sm">Compacto</Button>
        <Button>Tamanho padrão</Button>
      </Row>
      <Row label="Estados">
        <Button disabled>Desabilitado</Button>
        <Button variant="destructive">Ação destrutiva</Button>
      </Row>
    </div>
  );
}
