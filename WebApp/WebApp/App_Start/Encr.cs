using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace WebApp.App_Start
{
    public class Encr
    {
        public static string EncapsulateByteArray(byte[] array)
        {
            return Convert.ToBase64String(array);
        }

        public static byte[] EncapsulateString(string plainText)
        {
            return Convert.FromBase64String(plainText);
        }

        public static byte[] EncapsulateInt(int value)
        {
            //return Convert.FromBase64String(value.ToString());
            return BitConverter.GetBytes(value);
        }

        public static byte[] EncapsulateDouble(double value)
        {
            //return Convert.FromBase64String(value.ToString());
            return BitConverter.GetBytes(value);
        }

        public static byte[] EncapsulateLong(long value)
        {
            //return Convert.FromBase64String(value.ToString());
            return BitConverter.GetBytes(value);
        }

        public static void InitRijn()
        {
            try
            {
                CspParameters cspp = new CspParameters();
                RSACryptoServiceProvider rsa;
                const string keyName = "KeyRSA";
                cspp.KeyContainerName = keyName;
                cspp.Flags = CspProviderFlags.UseMachineKeyStore;
                rsa = new RSACryptoServiceProvider(cspp)
                {
                    PersistKeyInCsp = true
                };
                var privateKey = rsa.ExportParameters(true);
                var publicKey = rsa.ExportParameters(false);

                using (RijndaelManaged myRijndael = new RijndaelManaged())
                {
                    //initialization
                    myRijndael.Mode = CipherMode.CBC;
                    myRijndael.Padding = PaddingMode.PKCS7;
                    myRijndael.KeySize = 256;
                    myRijndael.BlockSize = 128;
                    myRijndael.GenerateKey();

                    rsa.ImportParameters(publicKey);
                    byte[] keyEncrypted = rsa.Encrypt(myRijndael.Key, false);
                    if (!Directory.Exists(@"C:\Rijn\"))
                    {
                        Directory.CreateDirectory(@"C:\Rijn\");
                    }

                    using (var writer = new BinaryWriter(File.Open(@"C:\Rijn\rijnKey.bin", FileMode.OpenOrCreate)))
                    {
                        writer.Write(keyEncrypted);
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Error: {0}", e.Message);
            }
        }
        public static byte[] EncryptStringToBytes(string plainText)
        {
            if (plainText == null || plainText.Length <= 0)
                throw new ArgumentNullException("plainText");
            CspParameters cspp = new CspParameters();
            RSACryptoServiceProvider rsa;
            const string keyName = "KeyRSA";
            cspp.KeyContainerName = keyName;
            cspp.Flags = CspProviderFlags.UseMachineKeyStore;
            rsa = new RSACryptoServiceProvider(cspp)
            {
                PersistKeyInCsp = true
            };
            var privateKey = rsa.ExportParameters(true);

            byte[] RijnKeyEncrypted = File.ReadAllBytes(@"C:\Rijn\rijnKey.bin");
            rsa.ImportParameters(privateKey);
            byte[] Key = rsa.Decrypt(RijnKeyEncrypted, false);
            byte[] encrypted;
            byte[] IV;
            using (RijndaelManaged rijAlg = new RijndaelManaged())
            {
                rijAlg.Mode = CipherMode.CBC;
                rijAlg.Padding = PaddingMode.PKCS7;
                rijAlg.KeySize = 256;
                rijAlg.BlockSize = 128;

                rijAlg.Key = Key;
                rijAlg.GenerateIV();
                IV = rijAlg.IV;

                ICryptoTransform encryptor = rijAlg.CreateEncryptor(rijAlg.Key, rijAlg.IV);

                using (MemoryStream msEncrypt = new MemoryStream())
                {
                    using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter swEncrypt = new StreamWriter(csEncrypt, Encoding.Default))
                        {
                            swEncrypt.Write(plainText);
                        }
                        encrypted = msEncrypt.ToArray();
                    }
                }
            }

            var combinedIvCt = new byte[IV.Length + encrypted.Length];
            Array.Copy(IV, 0, combinedIvCt, 0, IV.Length);
            Array.Copy(encrypted, 0, combinedIvCt, IV.Length, encrypted.Length);
            return combinedIvCt;
        }

        public static string DecryptStringFromBytes(byte[] cipherTextCombined)
        {
            if (cipherTextCombined == null || cipherTextCombined.Length <= 0)
                throw new ArgumentNullException("cipherText");
            CspParameters cspp = new CspParameters();
            RSACryptoServiceProvider rsa;
            const string keyName = "KeyRSA";
            cspp.KeyContainerName = keyName;
            cspp.Flags = CspProviderFlags.UseMachineKeyStore;
            rsa = new RSACryptoServiceProvider(cspp)
            {
                PersistKeyInCsp = true
            };
            var privateKey = rsa.ExportParameters(true);

            byte[] RijnKeyEncrypted = File.ReadAllBytes(@"C:\Rijn\rijnKey.bin");
            rsa.ImportParameters(privateKey);
            byte[] Key = rsa.Decrypt(RijnKeyEncrypted, false);
            string plaintext = null;
            using (RijndaelManaged rijAlg = new RijndaelManaged())
            {
                rijAlg.Mode = CipherMode.CBC;
                rijAlg.Padding = PaddingMode.PKCS7;
                rijAlg.KeySize = 256;
                rijAlg.BlockSize = 128;

                rijAlg.Key = Key;

                byte[] IV = new byte[rijAlg.BlockSize / 8];
                byte[] cipherText = new byte[cipherTextCombined.Length - IV.Length];

                Array.Copy(cipherTextCombined, IV, IV.Length);
                Array.Copy(cipherTextCombined, IV.Length, cipherText, 0, cipherText.Length);

                rijAlg.IV = IV;

                ICryptoTransform decryptor = rijAlg.CreateDecryptor(rijAlg.Key, rijAlg.IV);

                using (MemoryStream msDecrypt = new MemoryStream(cipherText))
                {
                    using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader srDecrypt = new StreamReader(csDecrypt, Encoding.Default))
                        {
                            plaintext = srDecrypt.ReadToEnd();
                        }
                    }
                }
            }
            return plaintext;
        }
    }
}