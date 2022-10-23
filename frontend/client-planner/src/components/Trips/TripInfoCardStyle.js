import styled from "styled-components";
import { motion } from "framer-motion";

export const Card = styled(motion.div)`
  height: 470px;
  width: 33%;
  margin: 1rem;
  border-radius: 20px;
  margin-bottom: 40px;
  overflow: hidden;
  cursor: pointer;
  background-color: #aba084;
  transition: all 0.3s ease-in-out;
`;

export const CardMedia = styled(motion.div)`
  height: auto;
  position: relative;
  overflow: hidden;
  img {
    width: 100%;
    height: 320px;
    object-fit: cover;
    transition: all 0.4s ease;
  }
`;

export const Caption = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 1.6vw;
  text-align: center;
  min-width: max-content;
`;

export const ButtonRibbon = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  color: white;
`;
