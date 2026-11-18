import { Badge } from '../../components/ui/badge';
import { Row } from '../parts';

export function BadgeDemo() {
  return (
    <div className="space-y-6 rounded-lg border bg-card p-5 text-card-foreground">
      <Row label="Disponibilidade">
        <Badge variant="active">Ativo</Badge>
        <Badge variant="soldOut">Esgotado</Badge>
        <Badge variant="inactive">Inativo</Badge>
      </Row>
      <Row label="Contexto">
        <Badge variant="demo">DEMO</Badge>
        <Badge variant="accent">Combo</Badge>
        <Badge variant="neutral">Aves Temperadas</Badge>
      </Row>
    </div>
  );
}
