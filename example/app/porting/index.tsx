import { Picker } from '@react-native-picker/picker'
import { DatePickerInput } from '@tashi-iu/react-native-paper-dates'
import Checkbox from 'expo-checkbox'
import { useCallback, useState } from 'react'
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

import { PortingEmbed } from '../../../src'
import { PortingStep } from '../../../src/PortingEmbed/nextPortingStep'

export default function PortingEmbedScreen() {
  const [sessionJson, setSessionJson] = useState('')
  const [connectSession, setConnectSession] = useState<any>(null)
  const [isLoaded, setLoaded] = useState(false)
  const [isCompleted, setCompleted] = useState(false)
  const [clickedCustomerSupport, setClickedCustomerSupport] = useState(false)
  const [portingStep, setPortingStep] = useState<PortingStep>()
  const [isChecked, setChecked] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [currentProvider, setCurrentProvider] = useState<string | undefined>(
    undefined
  )

  function handleSubmit() {
    setConnectSession(JSON.parse(sessionJson))
  }

  function handleReset() {
    setConnectSession(null)
  }

  const handleLoaded = useCallback(() => {
    console.log('onLoaded triggered')
    setLoaded(true)
  }, [])

  const handleError = useCallback((_error: Error) => {
    console.log('onError triggered')
    setLoaded(false)
    setConnectSession(null)
  }, [])

  const handleInitialized = useCallback(() => {
    console.log('onInitialized triggered, embed got a token')
  }, [])

  const titles: Record<string, string> = {
    holderDetails: 'Account Holder Information',
    'holderDetails.firstName': 'First name',
    'holderDetails.lastName': 'Last name',
    'holderDetails.birthday': 'Birthday',
    'holderDetails.cancel': 'Cancel',
    carrierDetails: 'Carrier Details Information',
    'carrierDetails.number': 'Account number',
    'carrierDetails.pin': 'Account PIN',
    address: 'Address Information',
    'address.line1': 'Street Address',
    'address.line2': 'Apt, Suite, other',
    'address.city': 'City',
    'address.postalCode': 'Postal Code',
    'address.state': 'State',
    'address.country': 'Country',
    'protectionDisabling.confirm': 'Confirm',
    'protectionDisabling.cancel': 'Cancel',
    portingInfoLink: 'See Porting instructions',
    'protectionDisabling.button': 'Request Porting Again',
    'portingDeclined.button': 'Contact Customer support',
    donorProvider: 'Current provider',
    'donorProvider.dropdown': 'Select your current provider',
  }

  return (
    <ScrollView
      style={{
        padding: 16,
      }}
    >
      <View
        style={{
          padding: 20,
          alignItems: 'center',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Text>Enter ConnectSession JSON:</Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: 'black',
            backgroundColor: 'white',
            width: '80%',
            marginBottom: 10,
            marginTop: 10,
          }}
          multiline
          numberOfLines={4}
          onChangeText={(value) => setSessionJson(value)}
          value={sessionJson}
        />
        <View style={{ flexDirection: 'row' }}>
          <Button title="Reset" onPress={handleReset} color="gray" />
          <View style={{ width: 10 }} />
          <Button title="Submit" onPress={handleSubmit} />
        </View>
      </View>
      <View style={{ width: '100%', height: 1, backgroundColor: 'gray' }} />
      {Boolean(!isLoaded && connectSession) && <Text>Loading...</Text>}
      {isCompleted && <Text>The porting is submitted!</Text>}
      {clickedCustomerSupport && (
        <Text>User has requested customer support</Text>
      )}
      {portingStep && <Text>Current Porting step: {portingStep}</Text>}
      {!isCompleted && (
        <PortingEmbed
          project="dev"
          connectSession={connectSession}
          onInitialized={handleInitialized}
          onLoaded={handleLoaded}
          onError={handleError}
          onCompleted={() => setCompleted(true)}
          onSupportRequested={() => setClickedCustomerSupport(true)}
          onPortingStep={(step) => setPortingStep(step)}
          defaultTextFont="Satoshi-Regular"
          renderTitle={(step) =>
            step != null && (
              <Text style={[customStyles.title]}>{titles[step]}</Text>
            )
          }
          renderInput={(name, onChangeText, inputMode) => (
            <TextInput
              onChangeText={onChangeText}
              placeholder={titles[name]}
              style={[customStyles.input]}
              inputMode={inputMode}
            />
          )}
          renderCheckbox={(onChecked) => (
            <View
              style={[
                { flexDirection: 'row', alignItems: 'center', padding: 12 },
              ]}
            >
              <Checkbox
                onValueChange={(checked) => {
                  onChecked(checked)
                  setChecked(checked)
                }}
                value={isChecked}
                color={isChecked ? '#4630EB' : undefined}
                style={[{ marginRight: 12 }]}
              />
              <Text>I confirm that I have requested my provider approval.</Text>
            </View>
          )}
          renderPrimaryButton={(onPress, name, isSubmitting, disabled) => {
            const title = name ? titles[name] : undefined
            return (
              <Button
                title={title ? title : isSubmitting ? 'Loading...' : 'Submit'}
                onPress={onPress}
                disabled={disabled}
                color={'blue'}
              />
            )
          }}
          renderSecondaryButton={(name, onPress) => (
            <TouchableOpacity onPress={onPress}>
              <Text
                style={[
                  {
                    color: '#007AEC',
                    fontSize: 16,
                    textAlign: 'center',
                    fontWeight: '700',
                    marginTop: 24,
                  },
                ]}
              >
                {titles[name]}
              </Text>
            </TouchableOpacity>
          )}
          renderAlertBanner={(variant, message) => (
            <View
              style={[
                {
                  padding: 16,
                  backgroundColor: variant === 'error' ? '#FFE4E6' : 'white',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                },
              ]}
            >
              <Text
                style={{
                  flex: 1,
                  flexWrap: 'wrap',
                  color: variant === 'error' ? '#BE123C' : 'black',
                }}
              >
                {message}
              </Text>
            </View>
          )}
          renderDate={(name, onChangeText) => (
            <DatePickerInput
              locale="en"
              label={titles[name]}
              value={date}
              placeholder="YYYY-MM-DD"
              withDateFormatInLabel={false}
              onChange={(d) => {
                setDate(d)
                const year = d?.getFullYear()
                const month = `0${(d?.getMonth() ?? 0) + 1}`.slice(-2)
                const day = `0${d?.getDate()}`.slice(-2)

                const dateString = `${year}-${month}-${day}` // needs to be an RFC3339 date string
                onChangeText(dateString)
              }}
              inputMode="start"
              style={{ marginTop: 24 }}
              mode="outlined"
            />
          )}
          renderPortingProtectionDisabledConfirmation={(onConfirm) => (
            <View style={[customStyles.confirmation]}>
              <Text style={[{ marginBottom: 12 }]}>
                After you have received confirmation that port protection has
                been deactivated and your number is prepared for porting, kindly
                inform us by clicking the button below to confirm.
              </Text>
              <Button title={'Confirm'} onPress={onConfirm} color={'blue'} />
            </View>
          )}
          renderProvidersDropdown={(name, providers, onChange) => (
            <Picker
              selectedValue={currentProvider}
              onValueChange={(itemValue, _itemIndex) => {
                onChange(itemValue as string)
                setCurrentProvider(itemValue)
              }}
            >
              {providers.map((p) => {
                return <Picker.Item key={p.id} label={p.name} value={p.id} />
              })}
            </Picker>
          )}
        />
      )}
    </ScrollView>
  )
}

const customStyles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'blue',
    marginBottom: 10,
    fontFamily: 'Satoshi-Regular',
  },
  input: {
    fontSize: 16,
    lineHeight: 20,
    height: 60,
    marginTop: 24,
    padding: 16,
    paddingTop: 14,
    backgroundColor: 'white',
    color: '#1f2937',
    borderRadius: 8,
    fontWeight: '500',
    borderWidth: 0,
    fontFamily: 'Satoshi-Regular',
  },
  button: {
    backgroundColor: 'blue',
  },
  confirmation: {
    marginTop: 24,
  },
})
