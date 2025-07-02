import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import sharedStyles from '../../styles/shared';

const PolicyScreen = ({ navigation }: any) => {
  return (
    <View style={sharedStyles.authContainer}>
      <TouchableOpacity style={sharedStyles.backButton} onPress={() => navigation.navigate('Signup')}>
        <View style={sharedStyles.backCircle}>
          <AntDesign name="arrowleft" size={28} color="#444" />
        </View>
      </TouchableOpacity>
      
      <ScrollView 
        style={{ flex: 1, width: '100%', marginTop: 120 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Text style={[sharedStyles.authTitle, { textAlign: 'left' }]}>Politique de confidentialité</Text>
        
        <View>
          <Text style={[sharedStyles.bodyText, { marginBottom: 20, textAlign: 'left' }]}>
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </Text>
          
          <Text style={[sharedStyles.bodyText, { marginBottom: 15, fontWeight: '600', textAlign: 'left' }]}>
            1. Collecte des informations
          </Text>
          <Text style={[sharedStyles.bodyText, { marginBottom: 20, textAlign: 'left' }]}>
            Nous collectons les informations que vous nous fournissez directement, telles que votre nom, 
            adresse e-mail et mot de passe lors de la création de votre compte.
          </Text>
          
          <Text style={[sharedStyles.bodyText, { marginBottom: 15, fontWeight: '600', textAlign: 'left' }]}>
            2. Utilisation des informations
          </Text>
          <Text style={[sharedStyles.bodyText, { marginBottom: 20, textAlign: 'left' }]}>
            Nous utilisons vos informations pour fournir, maintenir et améliorer nos services, 
            communiquer avec vous et assurer la sécurité de votre compte.
          </Text>
          
          <Text style={[sharedStyles.bodyText, { marginBottom: 15, fontWeight: '600', textAlign: 'left' }]}>
            3. Partage des informations
          </Text>
          <Text style={[sharedStyles.bodyText, { marginBottom: 20, textAlign: 'left' }]}>
            Nous ne vendons, n'échangeons ni ne louons vos informations personnelles à des tiers. 
            Nous pouvons partager vos informations uniquement dans les cas prévus par la loi.
          </Text>
          
          <Text style={[sharedStyles.bodyText, { marginBottom: 15, fontWeight: '600', textAlign: 'left' }]}>
            4. Sécurité des données
          </Text>
          <Text style={[sharedStyles.bodyText, { marginBottom: 20, textAlign: 'left' }]}>
            Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos informations 
            personnelles contre l'accès non autorisé, la modification, la divulgation ou la destruction.
          </Text>
          
          <Text style={[sharedStyles.bodyText, { marginBottom: 15, fontWeight: '600', textAlign: 'left' }]}>
            5. Vos droits
          </Text>
          <Text style={[sharedStyles.bodyText, { marginBottom: 20, textAlign: 'left' }]}>
            Vous avez le droit d'accéder, de corriger, de supprimer vos informations personnelles 
            et de vous opposer à leur traitement. Contactez-nous pour exercer ces droits.
          </Text>
          
          <Text style={[sharedStyles.bodyText, { marginBottom: 15, fontWeight: '600', textAlign: 'left' }]}>
            6. Cookies et technologies similaires
          </Text>
          <Text style={[sharedStyles.bodyText, { marginBottom: 20, textAlign: 'left' }]}>
            Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience 
            et analyser l'utilisation de notre application.
          </Text>
          
          <Text style={[sharedStyles.bodyText, { marginBottom: 15, fontWeight: '600', textAlign: 'left' }]}>
            7. Modifications de cette politique
          </Text>
          <Text style={[sharedStyles.bodyText, { marginBottom: 20, textAlign: 'left' }]}>
            Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. 
            Nous vous informerons de tout changement important.
          </Text>
          
          <Text style={[sharedStyles.bodyText, { marginBottom: 15, fontWeight: '600', textAlign: 'left' }]}>
            8. Contact
          </Text>
          <Text style={[sharedStyles.bodyText, { marginBottom: 20, textAlign: 'left' }]}>
            Si vous avez des questions concernant cette politique de confidentialité, 
            contactez-nous à : privacy@artizone.com
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default PolicyScreen; 