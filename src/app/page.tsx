import { SideBar } from "./components/sideBar/sideBar";
import ClientesEntregas from "./components/telasFull/clientesEntrega";
import NovoClienteEntregas from "./components/telasFull/novoClienteEntrega";
import { EntregasClientesProvedor } from "./components/contexts/entregasClientesContext";
import { ProvedorAutenticacao } from "./components/contexts/contextoUsuario";
import dynamic from "next/dynamic";
import MotoristasLogin from "./components/usuariosLogados/motoristaLogin";
import TelaMarcadorInform from "./components/informsMarcador/informsMarcador";
import TelaMotoristas from "./components/Tela Motoristas/dispMotora";
import { TelaFullRelatEntregas } from "./components/Relatorio Entregas/telaRelEntregas";

const Mapa = dynamic(() => import("./components/mapa/meuMapa"), { ssr: false });

export default function Home() {
  return (
    <main className="corpoProjeto">
      <ProvedorAutenticacao>
        <EntregasClientesProvedor>
          <Mapa>
            <SideBar />
            <ClientesEntregas />
            <NovoClienteEntregas />
            <MotoristasLogin />
            <TelaMarcadorInform />
            <TelaFullRelatEntregas />
          </Mapa>
          <TelaMotoristas />
        </EntregasClientesProvedor>
      </ProvedorAutenticacao>
    </main>
  );
}
