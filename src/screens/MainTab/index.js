import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Easing
} from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Icons, Images, Styles } from './../../constants/index'

const Screen1 = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'cyan'
      }}
    >
      <Text>Sreen 1</Text>
    </View>
  )
}
const Screen2 = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'violet'
      }}
    >
      <Text>Sreen 2</Text>
    </View>
  )
}
const Screen3 = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'blue'
      }}
    >
      <Text>Sreen 3</Text>
    </View>
  )
}
const Screen4 = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'gray'
      }}
    >
      <Text>Sreen 4</Text>
    </View>
  )
}

//=======================================
const COLOR = '#C8BFE7'
const HEIGHT_BAR = 76
const SIZE_ICON = 30
const ICON_OFFSET = 3
const BORDER_RADIUS = 8

const TabChild = ({ descriptors, state, navigation, route, index }) => {
  // constants
  const { options } = descriptors[route.key]

  const label =
    options.tabBarLabel !== undefined
      ? options.tabBarLabel
      : options.title !== undefined
      ? options.title
      : route.name

  const iconNone = options.tabBarIcon.none
  const iconFocused = options.tabBarIcon.focused

  const isFocused = state.index === index

  const translateY = useRef(new Animated.Value(0)).current

  // handles
  const onPress = () => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true
    })

    if (!isFocused && !event.defaultPrevented) {
      // The `merge: true` option makes sure that the params inside the tab screen are preserved
      navigation.navigate({ name: route.name, merge: true })
    }
  }

  const onLongPress = () => {
    navigation.emit({
      type: 'tabLongPress',
      target: route.key
    })
  }

  // effect
  useEffect(() => {
    isFocused &&
      Animated.spring(translateY, {
        toValue: -(
          HEIGHT_BAR / 2 +
          (ICON_OFFSET +
            (HEIGHT_BAR - 2 * BORDER_RADIUS - 2 * ICON_OFFSET - SIZE_ICON) /
              2) -
          (HEIGHT_BAR - SIZE_ICON) / 2
        ),
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true
      }).start()
    !isFocused &&
      Animated.timing(translateY, {
        toValue: 0,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true
      }).start()
  }, [isFocused])

  // render
  return (
    <TouchableOpacity
      accessibilityRole='button'
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarTestID}
      onPress={onPress}
      onLongPress={onLongPress}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Animated.Image
          source={isFocused ? iconFocused : iconNone}
          resizeMode='cover'
          style={{
            position: 'absolute',
            width: SIZE_ICON,
            height: SIZE_ICON,
            transform: [{ translateY }]
          }}
        />
        <Animated.Text
          style={{
            color: '#673ab7',
            transform: [
              {
                translateY: translateY.interpolate({
                  inputRange: [
                    -(
                      HEIGHT_BAR / 2 +
                      (ICON_OFFSET +
                        (HEIGHT_BAR -
                          2 * BORDER_RADIUS -
                          2 * ICON_OFFSET -
                          SIZE_ICON) /
                          2) -
                      (HEIGHT_BAR - SIZE_ICON) / 2
                    ),
                    0
                  ],
                  outputRange: [HEIGHT_BAR / 4, HEIGHT_BAR]
                })
              }
            ],
            opacity: translateY.interpolate({
              inputRange: [
                -(
                  HEIGHT_BAR / 2 +
                  (ICON_OFFSET +
                    (HEIGHT_BAR -
                      2 * BORDER_RADIUS -
                      2 * ICON_OFFSET -
                      SIZE_ICON) /
                      2) -
                  (HEIGHT_BAR - SIZE_ICON) / 2
                ),
                0
              ],
              outputRange: [1, 0]
            })
          }}
        >
          {label}
        </Animated.Text>
      </View>
    </TouchableOpacity>
  )
}

const TabBar = props => {
  //constants
  const { state, descriptors, navigation } = props

  const widthBar = Styles.width
  const totalTab = Object.keys(descriptors).length
  const [indexFocused, setIndexFocused] = useState(0)
  const translateX = useRef(new Animated.Value(0)).current

  // effects
  useEffect(() => {
    const descriptorsArr = Object.values(descriptors)
    for (i = 0; i < descriptorsArr.length; i++) {
      const { isFocused } = descriptorsArr[i].navigation
      if (isFocused()) {
        setIndexFocused(prev => (prev = i))
        break
      }
    }
  }, [descriptors])

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: (totalTab - (indexFocused + 1)) * -(widthBar / totalTab),
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: true
    }).start()
  }, [indexFocused])

  // render
  return (
    <View
      style={{
        flexDirection: 'row',
        height: HEIGHT_BAR,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
      }}
    >
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden'
        }}
      >
        <Animated.View
          style={{
            position: 'absolute',
            flexDirection: 'row',
            height: HEIGHT_BAR / 2,
            width: widthBar * 2 - widthBar / totalTab,
            transform: [{ translateX }],
            top: 0,
            left: 0
          }}
        >
          <View style={{ flexGrow: 1, backgroundColor: COLOR }} />
          <View
            style={{
              width: HEIGHT_BAR,
              aspectRatio: 2 / 1,
              overflow: 'hidden',
              flexDirection: 'row',
              zIndex: 10
            }}
          >
            <View
              style={{
                position: 'absolute',
                width: BORDER_RADIUS * 2,
                height: '100%',
                backgroundColor: COLOR,
                borderTopRightRadius: BORDER_RADIUS,
                left: -BORDER_RADIUS,
                zIndex: 10
              }}
            />
            <View
              style={{
                position: 'absolute',
                width: BORDER_RADIUS * 2,
                height: '100%',
                backgroundColor: COLOR,
                borderTopLeftRadius: BORDER_RADIUS,
                right: -BORDER_RADIUS,
                zIndex: 10
              }}
            />
            <View
              style={{
                position: 'relative',
                width: HEIGHT_BAR - BORDER_RADIUS * 2,
                aspectRatio: 2 / 1,
                top: BORDER_RADIUS,
                left: BORDER_RADIUS,
                overflow: 'hidden'
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  width: (HEIGHT_BAR - BORDER_RADIUS * 2) * 2,
                  aspectRatio: 1,
                  borderRadius: HEIGHT_BAR - BORDER_RADIUS * 2,
                  borderWidth: (HEIGHT_BAR - BORDER_RADIUS * 2) / 2,
                  top: -(HEIGHT_BAR - BORDER_RADIUS * 2),
                  left: -(HEIGHT_BAR - BORDER_RADIUS * 2) / 2,
                  borderColor: COLOR
                }}
              />
            </View>
          </View>
          <View style={{ flexGrow: 1, backgroundColor: COLOR }} />
        </Animated.View>

        <View
          style={{
            position: 'absolute',
            backgroundColor: COLOR,
            height: HEIGHT_BAR / 2,
            bottom: 0,
            left: 0,
            right: 0
          }}
        />
      </View>

      <Animated.View
        style={{
          width: HEIGHT_BAR - BORDER_RADIUS * 2 - ICON_OFFSET * 2,
          aspectRatio: 1,
          borderRadius: (HEIGHT_BAR - BORDER_RADIUS * 2 - ICON_OFFSET * 2) / 2,
          backgroundColor: 'pink',
          transform: [{ translateX }],
          position: 'absolute',
          bottom: HEIGHT_BAR / 2 + ICON_OFFSET,
          left:
            widthBar -
            widthBar / totalTab +
            (widthBar / totalTab -
              (HEIGHT_BAR - BORDER_RADIUS * 2 - ICON_OFFSET * 2)) /
              2
        }}
      />

      {state.routes.map((route, index) => (
        <TabChild
          key={index.toString()}
          descriptors={descriptors}
          state={state}
          navigation={navigation}
          route={route}
          index={index}
        />
      ))}
    </View>
  )
}

const Tab = createBottomTabNavigator()

const tabComponentArr = [
  {
    route: 'screen1',
    label: 'Screen 1',
    iconNone: Icons.example1,
    iconFocused: Icons.example2,
    component: Screen1
  },
  {
    route: 'screen2',
    label: 'Screen 2',
    iconNone: Icons.example1,
    iconFocused: Icons.example2,
    component: Screen2
  },
  {
    route: 'screen3',
    label: 'Screen 3',
    iconNone: Icons.example1,
    iconFocused: Icons.example2,
    component: Screen3
  },
  {
    route: 'screen4',
    label: 'Screen 4',
    iconNone: Icons.example1,
    iconFocused: Icons.example2,
    component: Screen4
  }
]

const MainTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false
      }}
      tabBar={props => <TabBar {...props} />}
    >
      {tabComponentArr.map((item, index) => (
        <Tab.Screen
          key={index.toString()}
          name={item.route}
          component={item.component}
          options={{
            tabBarLabel: item.label,
            tabBarIcon: {
              none: item.iconNone,
              focused: item.iconFocused
            }
          }}
        />
      ))}
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({})

export default MainTab
