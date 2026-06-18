import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { createProfile, deleteProfile, listProfiles, updateProfile } from './src/api/profileApi';
import EditProfileScreen from './src/screens/EditProfileScreen';
import GamesScreen from './src/screens/GamesScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import TipsScreen from './src/screens/TipsScreen';
import { colors } from './src/theme';

const initialProfile = {
  id: null,
  name: 'Usuario PeqInvest',
  email: 'usuario@email.com',
  cpf: '000.000.000-00',
  phone: '(11) 99999-9999',
  address: 'Rua dos Investidores, 100',
};

function fromApiProfile(profile) {
  if (!profile) {
    return initialProfile;
  }

  return {
    id: profile.id,
    name: profile.fullName || initialProfile.name,
    email: profile.email || '',
    cpf: profile.cpf || '',
    phone: profile.phone || '',
    address: profile.address || '',
  };
}

function toApiProfile(profile) {
  return {
    fullName: profile.name,
    email: profile.email,
    cpf: profile.cpf,
    phone: profile.phone,
    address: profile.address,
    investorType: 'iniciante',
    riskProfile: 'conservador',
    investmentGoal: 'Aprender a investir com seguranca',
    password: profile.password,
  };
}

export default function App() {
  const [activeRoute, setActiveRoute] = useState('login');
  const [profile, setProfile] = useState(initialProfile);
  const [message, setMessage] = useState('CRUD de perfil ja esta ativo no backend.');
  const [isSaving, setIsSaving] = useState(false);

  const navigate = (route) => setActiveRoute(route);

  useEffect(() => {
    listProfiles()
      .then((profiles) => {
        if (profiles.length > 0) {
          setProfile(fromApiProfile(profiles[0]));
          setMessage('Usuario carregado do banco de dados.');
        } else {
          setMessage('Nenhum usuario cadastrado ainda.');
        }
      })
      .catch(() => {
        setMessage('Backend nao conectado. Confira MySQL, .env e npm run dev no backend.');
      });
  }, []);

  const handleCreateProfile = async (nextProfile) => {
    setIsSaving(true);

    try {
      const createdProfile = await createProfile(toApiProfile(nextProfile));
      setProfile(fromApiProfile(createdProfile));
      setMessage('Usuario criado com sucesso no banco.');
      setActiveRoute('home');
    } catch (error) {
      setMessage(error.message === 'Email or CPF already registered' ? 'Usuario ja cadastrado com este email ou CPF.' : error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateProfile = async (nextProfile) => {
    if (!profile.id) {
      setMessage('Cadastre um usuario antes de editar.');
      setActiveRoute('register');
      return;
    }

    setIsSaving(true);

    try {
      const updatedProfile = await updateProfile(profile.id, toApiProfile(nextProfile));
      setProfile(fromApiProfile(updatedProfile));
      setMessage('Usuario alterado com sucesso.');
      setActiveRoute('profile');
    } catch (error) {
      setMessage(error.message === 'Email or CPF already registered' ? 'Usuario ja cadastrado com este email ou CPF.' : error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!profile.id) {
      setMessage('Nao existe usuario salvo para deletar.');
      return;
    }

    setIsSaving(true);

    try {
      await deleteProfile(profile.id);
      setProfile(initialProfile);
      setMessage('Usuario deletado com sucesso.');
      setActiveRoute('register');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const renderScreen = () => {
    if (activeRoute === 'register') {
      return <RegisterScreen isSaving={isSaving} message={message} onCreateProfile={handleCreateProfile} onNavigate={navigate} />;
    }

    if (activeRoute === 'login') {
      return <LoginScreen message={message} onNavigate={navigate} />;
    }

    if (activeRoute === 'games') {
      return <GamesScreen activeRoute={activeRoute} message={message} onNavigate={navigate} />;
    }

    if (activeRoute === 'tips') {
      return <TipsScreen activeRoute={activeRoute} message={message} onNavigate={navigate} />;
    }

    if (activeRoute === 'profile') {
      return (
        <ProfileScreen
          activeRoute={activeRoute}
          isSaving={isSaving}
          message={message}
          onDeleteProfile={handleDeleteProfile}
          onNavigate={navigate}
          profile={profile}
        />
      );
    }

    if (activeRoute === 'editProfile') {
      return (
        <EditProfileScreen
          activeRoute="profile"
          isSaving={isSaving}
          message={message}
          onNavigate={navigate}
          profile={profile}
          onSave={handleUpdateProfile}
        />
      );
    }

    return <HomeScreen activeRoute={activeRoute} message={message} onNavigate={navigate} profile={profile} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      {renderScreen()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
