"use client";

import { clientesTipo } from "@/types/clientesType";
import { entregasTipo } from "@/types/entregasTypes";
import {
  meusClientes,
  todasEntregas,
  todasEntregasRelatorio,
} from "@/utils/funcRotas";
import { createContext, useContext, useEffect, useState } from "react";
import socket from "../socket/socketCliente";
import { contextAutenticacao } from "./contextoUsuario";

interface EntregasContextProps {
  entregasDia: entregasTipo[] | undefined;
  entregasAndamento: entregasTipo[] | undefined;
  entregasConcluidas: entregasTipo[] | undefined;
  entregasRelatorio: entregasTipo[] | undefined;
  rotaEntregasMarcos: entregasTipo[] | undefined;
  rotaEntregasUene: entregasTipo[] | undefined;
  rotaEntregasLeo: entregasTipo[] | undefined;
  rotaEntregasJoao: entregasTipo[] | undefined;
  rotasEntregasMotoristas: (
    nomeMotorista: string,
    conjuntoEntregas: entregasTipo[]
  ) => void;
  atualizandoEntregas: () => void;
  atualizandoEntregasRelatorio: () => void;
  todosClientes: clientesTipo[] | undefined;
  atualizandoClientes: () => void;
}

export const ContextEntregasClientes = createContext<EntregasContextProps>(
  {} as any
);

export function EntregasClientesProvedor({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { usuarioLogado } = useContext(contextAutenticacao);
  const [entregasDia, setEntregasDia] = useState<entregasTipo[]>();
  const [entregasAndamento, setEntregasAndamento] = useState<entregasTipo[]>();
  const [entregasConcluidas, setEntregasConcluidas] =
    useState<entregasTipo[]>();
  const [todosClientes, setTodosClientes] = useState<clientesTipo[]>();
  const [entregasRelatorio, setEntregasRelatorio] = useState<entregasTipo[]>();

  const atualizandoEntregas = () => {
    todasEntregas().then(async (response) => {
      if (response) {
        let todasEntregas: entregasTipo[] = response;

        let dataEntregasDisponiveis = todasEntregas.filter(
          (entrega) => entrega.status === "Disponível"
        );
        let dataEntregasAndamento = todasEntregas.filter(
          (entrega) => entrega.status === "Entregando"
        );
        let dataEntregasConcluidas = todasEntregas.filter(
          (entrega) => entrega.status === "Concluída"
        );

        setEntregasDia(dataEntregasDisponiveis);
        setEntregasAndamento(dataEntregasAndamento);
        setEntregasConcluidas(dataEntregasConcluidas);
      }
    });
  };

  const atualizandoEntregasRelatorio = () => {
    todasEntregasRelatorio().then(async (response) => {
      await setEntregasRelatorio(response);
    });
  };

  const [rotaEntregasMarcos, setRotaEntregaMarcos] = useState<entregasTipo[]>();
  const [rotaEntregasUene, setRotaEntregaUene] = useState<entregasTipo[]>();
  const [rotaEntregasLeo, setRotaEntregaLeo] = useState<entregasTipo[]>();
  const [rotaEntregasJoao, setRotaEntregaJoao] = useState<entregasTipo[]>();

  const rotasEntregasMotoristas = (
    nomeMotorista: string,
    conjuntoEntregas: entregasTipo[]
  ) => {
    if (nomeMotorista === "Marcos") {
      setRotaEntregaMarcos(conjuntoEntregas);
    } else if (nomeMotorista === "Uene") {
      setRotaEntregaUene(conjuntoEntregas);
    } else if (nomeMotorista === "Leo") {
      setRotaEntregaLeo(conjuntoEntregas);
    } else if (nomeMotorista === "João") {
      setRotaEntregaJoao(conjuntoEntregas);
    }
  };

  useEffect(() => {
    socket.on("informandoClientesUpdateEntregas", () => {
      console.log("Todas as entregas foram informadas aos demais usuarios");
      atualizandoEntregas();
    });
    return () => {
      socket.off("informandoClientesUpdateEntregas");
    };
  }, []);

  const atualizandoClientes = () => {
    if (usuarioLogado?.userName === "Administradores")
      meusClientes().then(async (response) => {
        console.log("Quantidade de clientes retornados: " + response?.length);
        if (response) {
          let clientes = response;
          setTodosClientes(clientes);
        }
      });
  };

  return (
    <ContextEntregasClientes.Provider
      value={{
        entregasDia,
        entregasRelatorio,
        entregasAndamento,
        entregasConcluidas,
        atualizandoEntregas,
        atualizandoEntregasRelatorio,
        todosClientes,
        atualizandoClientes,
        rotasEntregasMotoristas,
        rotaEntregasMarcos,
        rotaEntregasUene,
        rotaEntregasLeo,
        rotaEntregasJoao,
      }}
    >
      {children}
    </ContextEntregasClientes.Provider>
  );
}
