import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const grayButton = ({ title, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.button}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'gray', // Color de fondo rojo
        paddingVertical: 10, // Espaciado vertical
        paddingHorizontal: 15, // Espaciado horizontal
        borderRadius: 5, // Bordes redondeados
        alignItems: 'center', // Centrar el contenido
        shadowColor: '#000', // Color de sombra
        shadowOffset: {
            width: 0, // Desplazamiento en el eje X
            height: 2, // Desplazamiento en el eje Y
        },
        shadowOpacity: 0.25, // Opacidad de la sombra
        shadowRadius: 3.5, // Radio de la sombra
        elevation: 5, // Elevación para Android
    },
    buttonText: {
        color: 'white', // Color del texto blanco
        fontSize: 18, // Tamaño de la fuente
        fontWeight: 'bold', // Negrita
    },
});

export default grayButton;
