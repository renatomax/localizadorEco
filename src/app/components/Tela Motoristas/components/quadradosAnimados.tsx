"use client";
import sam from "@/styles/telaMotoristas/animandoTelaMotora.module.css";

export const AnimandoQuadrados = () => {
  const quadrados = [];
  for (let i = 0; i < 10; i++) {
    let tamanho = `${numAleatoreo(25, 80)}px`;
    quadrados.push(
      <div
        key={i}
        style={{
          left: `${numAleatoreo(0, 80)}%`,
          animationDelay: `${numAleatoreo(0, 10)}s`,
          width: tamanho,
          height: tamanho,
        }}
        className={sam.quadradoAnim}
      ></div>
    );
  }
  return quadrados;
};

function numAleatoreo(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
