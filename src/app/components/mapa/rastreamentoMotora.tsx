import { useContext } from "react";
import { contextMapa } from "./meuMapa";
import {
  marcadorMotoristas,
  markerEntregaAndamento,
} from "./components/iconesLocation";
import { contextAutenticacao } from "../contexts/contextoUsuario";
import * as leaflet from "leaflet";

export function LocalizandoMeusMotoristas() {
  const { mapaPronto } = useContext(contextMapa);
  const { marcosUser, ueneUser, leoUser, joaoUser } =
    useContext(contextAutenticacao);

  const marcadorMarcos = marcadorMotoristas();
  if (marcosUser.localizacao.latitude && marcosUser.localizacao.longitude)
    leaflet.marker([
      marcosUser.localizacao.latitude,
      marcosUser.localizacao.longitude,
    ]);
}
