import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { notificationService } from '../services/notificationService';
import { SafeAreaView } from 'react-native-safe-area-context';

export const CreateNotificationScreen = ({ navigation }: any) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!title || !body) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Assuming sending to 'self' or handled by backend logic (to: 'current_user_token' or topic)
      // For this case study, we just send title/body.
      await notificationService.createNotification({
        to: 'self', // or specific token if the app supports picking users
        title,
        body,
        data: { screen: 'NotificationList' }
      });
      Alert.alert('Success', 'Notification sent!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to send notification');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
       <View style={styles.header}>
        <Button mode="text" onPress={() => navigation.goBack()}>Back</Button>
        <Text variant="headlineSmall">New Notification</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.form}>
        <TextInput
          label="Title"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={styles.input}
        />
         <TextInput
          label="Message"
          value={body}
          onChangeText={setBody}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.input}
        />
        
        <Button 
          mode="contained" 
          onPress={handleSend} 
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          Send Notification
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  form: {
    padding: 20,
    gap: 15,
  },
  input: {
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 10,
  },
});
