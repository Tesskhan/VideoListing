import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C1E',
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#FFF',
    },
    whiteTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#FFF',
    },
    map: {
        width: '100%',  // Ancho del mapa al 100% del contenedor
        height: '100%',  // Alto del mapa al 50% de la pantalla
    },
    imagePlaceholder: {
        width: '100%',
        height: 200,
        backgroundColor: '#555',
        borderRadius: 8,
        marginBottom: 16,
    },
    optionsContainer: {
        position: 'absolute',
        bottom: 80,
    },
    tagAndTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    postTag: {
        fontSize: 14,
        color: '#EE0000',
        backgroundColor: '#333',
        borderRadius: 5,
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    postedTime: {
        fontSize: 14,
        color: '#A9A9A9',
    },
    description: {
        fontSize: 16,
        color: '#D9D9D9',
        textAlign: 'center',
        marginBottom: 20,
    },
    iconRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginVertical: 16,
    },
    icon: {
        marginHorizontal: 10,
    },
    commentsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        marginTop: 20,
    },
    comment: {
        fontSize: 16,
        color: '#D9D9D9',
        marginBottom: 5,
    },
    commentInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        borderRadius: 20,
        paddingHorizontal: 10,
        marginBottom: 20,
        paddingVertical: 5,
        position: 'absolute',
        bottom: 0,
        left: 16, // Added margin from the left edge
        right: 16, // Added margin from the right edge
    },
    commentInput: {
        flex: 1,
        color: '#000',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    postIconContainer: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    imageContainer: {
        width: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 100,
        borderRadius: 10,
    },
    buttonsContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 20,
    },
    button: {
        marginHorizontal: 20,
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#',
        fontSize: 18,
    },
    container: {
        flex: 1,
        backgroundColor: '#1C1C1E',
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#FFF',
    },
    imagePlaceholder: {
        width: '100%',
        height: 200,
        backgroundColor: '#555',
        borderRadius: 8,
        marginBottom: 16,
    },
    tagAndTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    postTag: {
        fontSize: 14,
        color: '#EE0000',
        backgroundColor: '#333',
        borderRadius: 5,
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    postedTime: {
        fontSize: 14,
        color: '#A9A9A9',
    },
    description: {
        fontSize: 16,
        color: '#D9D9D9',
        textAlign: 'center',
        marginBottom: 20,
    },
    iconRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginVertical: 16,
    },
    icon: {
        marginHorizontal: 10,
    },
    commentsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        marginTop: 20,
    },
    comment: {
        fontSize: 16,
        color: '#D9D9D9',
        marginBottom: 5,
    },
    commentInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        borderRadius: 20,
        paddingHorizontal: 10,
        marginBottom: 20,
        paddingVertical: 5,
        position: 'absolute',
        bottom: 0,
        left: 16, // Added margin from the left edge
        right: 16, // Added margin from the right edge
    },
    commentInput: {
        flex: 1,
        color: '#000',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    postIconContainer: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    likeText: {
        color: '#fff',
    },
});
