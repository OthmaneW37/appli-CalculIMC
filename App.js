import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView, Animated, Dimensions } from 'react-native';
import { useState, useRef, useEffect } from 'react';

export default function App() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [imc, setImc] = useState(null);
  const [status, setStatus] = useState('');
  const [image, setImage] = useState(null);
  const [statusColor, setStatusColor] = useState('');
  
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;
  const { width } = Dimensions.get('window');

  const triggerAnimation = () => {
    scaleAnim.setValue(0);
    opacityAnim.setValue(0);
    slideAnim.setValue(100);

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const calculateIMC = () => {
    if (weight && height) {
      const weightValue = parseFloat(weight);
      const heightValue = parseFloat(height);
      
      if (weightValue <= 0 || heightValue <= 0) {
        alert('Veuillez entrer des valeurs positives');
        return;
      }

      const heightInMeters = heightValue / 100;
      const imcValue = weightValue / (heightInMeters * heightInMeters);
      setImc(imcValue.toFixed(2));

      if (imcValue < 18.5) {
        setStatus('Maigreur');
        setStatusColor('#3498db');
        setImage(require('./assets/maigre.png'));
      } else if (imcValue < 25) {
        setStatus('Poids Normal');
        setStatusColor('#2ecc71');
        setImage(require('./assets/normal.png'));
      } else if (imcValue < 30) {
        setStatus('Surpoids');
        setStatusColor('#f39c12');
        setImage(require('./assets/surpoids.png'));
      } else if (imcValue < 35) {
        setStatus('Obésité');
        setStatusColor('#e74c3c');
        setImage(require('./assets/obese.png'));
      } else {
        setStatus('Obésité Sévère');
        setStatusColor('#c0392b');
        setImage(require('./assets/t_obese.png'));
      }
      
      triggerAnimation();
    } else {
      alert('Veuillez remplir tous les champs');
    }
  };

  const reset = () => {
    setWeight('');
    setHeight('');
    setImc(null);
    setStatus('');
    setImage(null);
    setStatusColor('');
    scaleAnim.setValue(0);
    opacityAnim.setValue(0);
    slideAnim.setValue(100);
  };

  const getIMCMessage = (imcValue) => {
    if (imcValue < 18.5) {
      return "Vous êtes en situation de maigreur. Consultez un professionnel de santé si nécessaire.";
    } else if (imcValue < 25) {
      return "Bravo ! Vous avez un poids normal et une bonne santé.";
    } else if (imcValue < 30) {
      return "Vous êtes en situation de surpoids. Une activité physique régulière est recommandée.";
    } else if (imcValue < 35) {
      return "Vous êtes en situation d'obésité. Consultez un professionnel de santé.";
    } else {
      return "Vous êtes en situation d'obésité sévère. Une consultation médicale est vivement conseillée.";
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('./assets/imc.png')}
          style={styles.headerImage}
          resizeMode="contain"
        />
        <Text style={styles.title}>Calculateur d'IMC</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>🏋️ Poids (kg)</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez votre poids"
          keyboardType="decimal-pad"
          value={weight}
          onChangeText={setWeight}
          placeholderTextColor="#999"
        />
        {weight && <Text style={styles.inputHint}>{weight} kg</Text>}

        <Text style={styles.label}>📏 Taille (cm)</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez votre taille"
          keyboardType="decimal-pad"
          value={height}
          onChangeText={setHeight}
          placeholderTextColor="#999"
        />
        {height && <Text style={styles.inputHint}>{height} cm</Text>}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.buttonCalculate}
            onPress={calculateIMC}
          >
            <Text style={styles.buttonText}>Calculer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonReset}
            onPress={reset}
          >
            <Text style={styles.buttonText}>Réinitialiser</Text>
          </TouchableOpacity>
        </View>
      </View>

      {imc && (
        <Animated.View
          style={[
            styles.resultContainer,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <View style={[styles.imcBox, { backgroundColor: statusColor }]}>
            <Text style={styles.imcLabel}>Votre IMC</Text>
            <Text style={styles.imcValue}>{imc}</Text>
          </View>

          <Animated.View
            style={[
              styles.statusBox,
              {
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
            <Text style={styles.messageText}>{getIMCMessage(parseFloat(imc))}</Text>
          </Animated.View>
          
          {image && (
            <Animated.Image
              source={image}
              style={[
                styles.resultImage,
                {
                  opacity: opacityAnim,
                },
              ]}
              resizeMode="contain"
            />
          )}

          <View style={styles.infoContainer}>
            <Image
              source={require('./assets/Maigreur-185-960x502.jpg')}
              style={styles.classificationImage}
              resizeMode="contain"
            />
          </View>
        </Animated.View>
      )}

      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#e0e0e0',
  },
  headerImage: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    fontWeight: '500',
  },
  inputHint: {
    fontSize: 12,
    color: '#3498db',
    marginTop: 5,
    marginLeft: 5,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    gap: 12,
  },
  buttonCalculate: {
    flex: 1,
    backgroundColor: '#27ae60',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#27ae60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonReset: {
    flex: 1,
    backgroundColor: '#e74c3c',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  resultContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  imcBox: {
    width: '100%',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  imcLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    opacity: 0.9,
    marginBottom: 5,
  },
  imcValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusBox: {
    width: '100%',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  statusText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  messageText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    lineHeight: 20,
  },
  resultImage: {
    width: 180,
    height: 180,
    marginVertical: 15,
  },
  infoContainer: {
    marginTop: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  classificationImage: {
    width: '100%',
    height: 220,
  },
});
