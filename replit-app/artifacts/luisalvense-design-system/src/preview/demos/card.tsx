import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';

export function CardDemo() {
  return (
    <div className="grid max-w-3xl gap-4 sm:grid-cols-2">
      <Card>
        <div className="grid h-28 place-items-center bg-secondary/70 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Espaço para imagem
        </div>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Aves Temperadas · kg</span>
            <Badge variant="active">Ativo</Badge>
          </div>
          <CardTitle>Coração de Frango</CardTitle>
          <CardDescription>Tempero rústico de alho e sal grosso.</CardDescription>
        </CardHeader>
        <CardContent className="pt-1">
          <strong className="text-base font-bold text-primary">R$ 39,90</strong>
          <span className="ml-1 text-[11px] text-muted-foreground">/kg</span>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" size="sm">Editar</Button>
          <Button variant="outline" size="sm">Duplicar</Button>
        </CardFooter>
      </Card>
      <Card className="flex min-h-56 flex-col justify-center border-dashed text-center hover:translate-y-0">
        <CardHeader>
          <CardTitle>Nenhum resultado</CardTitle>
          <CardDescription>Ajuste sua busca ou categoria para continuar.</CardDescription>
        </CardHeader>
        <CardContent><Button variant="outline" size="sm">Limpar filtros</Button></CardContent>
      </Card>
    </div>
  );
}
