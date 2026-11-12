import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const FONT = Platform.select({
  ios: 'PingFang SC',
  android: 'sans-serif',
  default: 'sans-serif',
});

const BLUE = '#2F9CF7';
const BLUE_SOFT = '#E8F3FF';
const GRAY = '#9AA5B1';
const INK = '#1A1A1A';
const SUB = '#6B7684';
const PH = '#EDF1F6';
const PH_LINE = '#DCE3EC';

const TABS = [
  { id: 'home', name: '首页', icon: 'home' },
  { id: 'apps', name: '软件', icon: 'box' },
  { id: 'find', name: '发现', icon: 'compass' },
  { id: 'more', name: '更多', icon: 'more' },
];

function ShareIcon() {
  return (
    <View style={styles.shareIcon}>
      <View style={styles.shareArrow} />
      <View style={styles.shareStem} />
      <View style={styles.shareTray} />
    </View>
  );
}

function TabIcon({ type, color }) {
  if (type === 'home') {
    return (
      <View style={styles.iconHome}>
        <View style={[styles.homeRoof, { borderBottomColor: color }]} />
        <View style={[styles.homeBody, { borderColor: color }]} />
      </View>
    );
  }
  if (type === 'box') {
    return (
      <View style={[styles.iconSquare, { borderColor: color }]}>
        <View style={[styles.boxInner, { backgroundColor: color }]} />
      </View>
    );
  }
  if (type === 'compass') {
    return (
      <View style={[styles.iconCircle, { borderColor: color }]}>
        <View style={[styles.compassDot, { backgroundColor: color }]} />
      </View>
    );
  }
  return (
    <View style={styles.iconMore}>
      {[0, 1, 2].map((i) => (
        <View key={i} style={[styles.moreDot, { backgroundColor: color }]} />
      ))}
    </View>
  );
}

function Placeholder({ height, label }) {
  return (
    <View style={[styles.ph, { height }]}>
      <Text style={styles.phLabel}>{label}</Text>
    </View>
  );
}

export default function App() {
  const [tab, setTab] = useState('home');

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <View style={styles.deco1} />
        <View style={styles.deco2} />
        <Text style={styles.headerTitle}>首页</Text>
        <Text style={styles.headerSub}>欢迎使用小七软件库，点击右上角可分享软件！</Text>
        <Pressable style={styles.shareWrap} hitSlop={10}>
          <ShareIcon />
        </Pressable>
      </View>

      <View style={styles.sheet}>
        <ScrollView
          contentContainerStyle={styles.sheetContent}
          showsVerticalScrollIndicator={false}
        >
          <Placeholder height={180} label="Banner 图" />

          <View style={styles.notice}>
            <View style={styles.noticeTag}>
              <Text style={styles.noticeTagText}>公告</Text>
            </View>
            <Text style={styles.noticeText} numberOfLines={1}>
              此处为公告内容，待填写
            </Text>
            <Text style={styles.chevron}>›</Text>
          </View>

          <Text style={styles.sectionTitle}>公告专区</Text>

          <View style={styles.grid}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <View key={i} style={styles.tile}>
                <Placeholder height={104} label="" />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.tabbar}>
        {TABS.map((t) => {
          const on = t.id === tab;
          const color = on ? BLUE : GRAY;
          return (
            <Pressable key={t.id} style={styles.tabItem} onPress={() => setTab(t.id)}>
              <TabIcon type={t.icon} color={color} />
              <Text style={[styles.tabLabel, { color }]}>{t.name}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BLUE,
  },
  header: {
    backgroundColor: BLUE,
    paddingTop: Platform.select({ ios: 62, android: 42, default: 42 }),
    paddingHorizontal: 20,
    paddingBottom: 56,
  },
  deco1: {
    position: 'absolute',
    top: 46,
    right: 34,
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  deco2: {
    position: 'absolute',
    top: 84,
    right: 72,
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  headerTitle: {
    fontFamily: FONT,
    fontStyle: 'normal',
    fontSize: 28,
    fontWeight: '500',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  headerSub: {
    fontFamily: FONT,
    fontStyle: 'normal',
    marginTop: 8,
    fontSize: 13,
    color: 'rgba(255,255,255,0.92)',
    lineHeight: 19,
    paddingRight: 60,
  },
  shareWrap: {
    position: 'absolute',
    right: 18,
    top: Platform.select({ ios: 54, android: 34, default: 34 }),
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareIcon: {
    width: 20,
    height: 20,
  },
  shareArrow: {
    position: 'absolute',
    top: 0,
    left: 5,
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFFFFF',
  },
  shareStem: {
    position: 'absolute',
    top: 5,
    left: 9,
    width: 2,
    height: 8,
    backgroundColor: '#FFFFFF',
  },
  shareTray: {
    position: 'absolute',
    bottom: 0,
    left: 2,
    width: 16,
    height: 9,
    borderWidth: 2,
    borderTopWidth: 0,
    borderColor: '#FFFFFF',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  sheet: {
    flex: 1,
    marginTop: -32,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    overflow: 'hidden',
  },
  sheetContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  ph: {
    backgroundColor: PH,
    borderWidth: 1,
    borderColor: PH_LINE,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phLabel: {
    fontFamily: FONT,
    fontStyle: 'normal',
    fontSize: 12,
    color: '#A9B4C2',
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEF1F5',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  noticeTag: {
    backgroundColor: BLUE_SOFT,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginRight: 10,
  },
  noticeTagText: {
    fontFamily: FONT,
    fontStyle: 'normal',
    fontSize: 12,
    color: BLUE,
    fontWeight: '500',
  },
  noticeText: {
    flex: 1,
    fontFamily: FONT,
    fontStyle: 'normal',
    fontSize: 13,
    color: SUB,
  },
  chevron: {
    fontFamily: FONT,
    fontStyle: 'normal',
    fontSize: 18,
    color: '#C3CBD6',
    marginLeft: 6,
  },
  sectionTitle: {
    fontFamily: FONT,
    fontStyle: 'normal',
    marginTop: 22,
    marginBottom: 12,
    fontSize: 17,
    fontWeight: '500',
    color: INK,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tile: {
    width: '48.5%',
    marginBottom: 12,
  },
  tabbar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5',
    paddingTop: 8,
    paddingBottom: Platform.select({ ios: 24, android: 10, default: 10 }),
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabLabel: {
    fontFamily: FONT,
    fontStyle: 'normal',
    marginTop: 4,
    fontSize: 10.5,
  },
  iconHome: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  homeRoof: {
    width: 0,
    height: 0,
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  homeBody: {
    width: 13,
    height: 9,
    borderWidth: 1.8,
    borderTopWidth: 0,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    marginTop: -1,
  },
  iconSquare: {
    width: 18,
    height: 18,
    borderWidth: 1.8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxInner: {
    width: 6,
    height: 6,
    borderRadius: 1.5,
  },
  iconCircle: {
    width: 18,
    height: 18,
    borderWidth: 1.8,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compassDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  iconMore: {
    flexDirection: 'row',
    height: 20,
    alignItems: 'center',
  },
  moreDot: {
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
    marginHorizontal: 1.4,
  },
});
