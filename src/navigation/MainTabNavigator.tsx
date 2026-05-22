import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MainTabParams} from './types';
import {Colors, Spacing, Typography, BorderRadius} from '../theme';
import HomeScreen from '../screens/Home/HomeScreen';
import TemplatesScreen from '../screens/Templates/TemplatesScreen';
import ProjectsScreen from '../screens/Projects/ProjectsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParams>();

function TabIcon({
  name,
  emoji,
  focused,
  label,
}: {
  name: string;
  emoji: string;
  focused: boolean;
  label: string;
}) {
  return (
    <View style={[styles.tabItem, focused && styles.tabItemActive]}>
      <Text style={styles.tabEmoji}>{emoji}</Text>
      {focused && <Text style={styles.tabLabel}>{label}</Text>}
    </View>
  );
}

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon name="home" emoji="🏠" focused={focused} label="Home" />
          ),
        }}
      />
      <Tab.Screen
        name="Templates"
        component={TemplatesScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon name="template" emoji="🎨" focused={focused} label="Templates" />
          ),
        }}
      />
      <Tab.Screen
        name="Projects"
        component={ProjectsScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon name="projects" emoji="📁" focused={focused} label="Projects" />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon name="profile" emoji="👤" focused={focused} label="Profile" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 84 : 68,
    paddingTop: Spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xl : Spacing.sm,
    elevation: 20,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.lg,
    minWidth: 60,
  },
  tabItemActive: {
    backgroundColor: Colors.primaryTransparent20,
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  tabEmoji: {
    fontSize: 22,
  },
  tabLabel: {
    ...Typography.tag,
    color: Colors.primary,
    marginLeft: 2,
  },
});
