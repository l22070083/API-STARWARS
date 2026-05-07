import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity, ActivityIndicator, View } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

interface SwapiItem {
  uid: string;
  name: string;
  url?: string;
}

export default function HomeScreen() {
  const [datos, setDatos] = useState<SwapiItem[]>([]);
  const [cargando, setCargando] = useState(false);
  const [categoriaActual, setCategoriaActual] = useState<string>('');

  const obtenerDatosDeSWAPI = async (endpoint: string, nombreCategoria: string) => {
    setCargando(true);
    setCategoriaActual(nombreCategoria);
    try {
      const respuesta = await fetch(`https://www.swapi.tech/api/${endpoint}`);
      const json = await respuesta.json();
      setDatos(json.results);
    } catch (error) {
      console.error("Error al obtener datos de SWAPI: ", error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <ParallaxScrollView
      // Fondo negro para que combine con el logo de Star Wars
      headerBackgroundColor={{ light: '#000000', dark: '#000000' }}
      headerImage={
        <Image
          // Ruta de tu nueva imagen de Star Wars
          source={require('@/assets/images/starwars.webp')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Prueba API Star Wars!</ThemedText>
        <HelloWave />
      </ThemedView>
      

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">SWAPI</ThemedText>
        
        {/* Contenedor para los 3 botones en fila */}
        <View style={styles.contenedorBotones}>
          <TouchableOpacity 
            style={styles.botonPequeño} 
            onPress={() => obtenerDatosDeSWAPI('people', 'Personajes')}
          >
            <ThemedText style={styles.textoBoton}>Personajes</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.botonPequeño} 
            onPress={() => obtenerDatosDeSWAPI('planets', 'Planetas')}
          >
            <ThemedText style={styles.textoBoton}>Planetas</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.botonPequeño} 
            onPress={() => obtenerDatosDeSWAPI('starships', 'Naves')}
          >
            <ThemedText style={styles.textoBoton}>Naves</ThemedText>
          </TouchableOpacity>
        </View>


        {categoriaActual !== '' && !cargando && (
          <ThemedText type="defaultSemiBold" style={{ marginBottom: 10, textAlign: 'center' }}>
            Mostrando: {categoriaActual}
          </ThemedText>
        )}

        {cargando ? (
          <View style={styles.centrado}>
            <ActivityIndicator size="large" color="#FFE81F" />
            <ThemedText style={styles.textoCargando}>Viajando a una galaxia muy lejana...</ThemedText>
          </View>
        ) : (
          
          datos.map((item) => {
            
            const categoriaImagen = categoriaActual === 'Personajes' ? 'characters' 
                                  : categoriaActual === 'Planetas' ? 'planets' 
                                  : 'starships';
            
            
            const urlImagen = `https://starwars-visualguide.com/assets/img/${categoriaImagen}/${item.uid}.jpg`;

            return (
              <ThemedView key={item.uid} style={styles.tarjeta}>
                
                <Image 
                  source={{ uri: urlImagen }}
                  style={styles.imagenTarjeta}
                  contentFit="cover"
                />

                <ThemedText type="defaultSemiBold" style={{ textAlign: 'center' }}>
                  {item.name}
                </ThemedText>
              </ThemedView>
            );
          })
        )}
      </ThemedView>
      {/* -------------------------------------- */}

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 100, 
    width: '80%', 
    bottom: 10,
    left: '10%',
    position: 'absolute',
    objectFit: 'contain', 
  },
  contenedorBotones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
    gap: 10,
  },
  botonPequeño: {
    backgroundColor: '#FFE81F',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1, 
  },
  textoBoton: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  centrado: {
    marginVertical: 20,
    alignItems: 'center',
  },
  textoCargando: {
    marginTop: 10,
    fontStyle: 'italic',
  },
  tarjeta: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(150, 150, 150, 0.3)', 
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
  },

  imagenTarjeta: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#333', 
  }
});