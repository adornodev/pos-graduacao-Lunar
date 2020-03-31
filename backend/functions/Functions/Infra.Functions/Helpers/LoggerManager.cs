using Infra.Functions.Interfaces;
using NLog;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Runtime.CompilerServices;
using System.Text;

namespace Infra.Functions.Helpers
{
    public class LoggerManager : ILoggerManager
    {
        private static ILogger logger = LogManager.GetCurrentClassLogger();
        private static string baseLogKey = "bsk";
        public static string logKey = "bsk";
        private static object myLock = new object();
        private static string hostName = string.Empty;
        private static string invocationId;
        private static string functionInstanceId;

        public LoggerManager()
        {

        }

        private static string GetClassNameFromCallerFilePath(string callerFilePath)
        {
            var className = "";
            if (!string.IsNullOrWhiteSpace(callerFilePath))
            {
                className = Path.GetFileNameWithoutExtension(callerFilePath);
            }

            return className;
        }

        
        public void LogDebug(string message,
            [CallerMemberName] string method = "",
            [CallerFilePath]string callerFilePath = "",
            Dictionary<string, object> customProperties = null)
        {
            string className = GetClassNameFromCallerFilePath(callerFilePath);
            string msg = $"{className}|{method}|{message}";

            LogEventInfo e = new LogEventInfo();
            e.Message = message;
            e.Level = LogLevel.Debug;

            e.Properties["method"] = method;
            e.Properties["callerFilePath"] = callerFilePath;
            e.Properties["env"] = logKey;
            e.Properties["host"] = hostName;
            e.Properties["invocation-id"] = invocationId;
            e.Properties["instance-id"] = functionInstanceId;



            // Adds custom properties to logZ
            if (customProperties != null)
                customProperties.ToList().ForEach(x => e.Properties[x.Key] = x.Value);

            logger.Log(e);

            SendConsoleMessage(msg, "debug");
        }

        public void LogError(string message,
            [CallerMemberName] string method = "",
            [CallerFilePath]string callerFilePath = "", Exception ex = null,
            Dictionary<string, object> customProperties = null)
        {
            string className = GetClassNameFromCallerFilePath(callerFilePath);
            var msg = $"{className}|{method}|{message}";
            LogEventInfo e = new LogEventInfo();
            e.Message = message;
            e.Level = LogLevel.Error;
            e.Properties["method"] = method;
            e.Properties["callerFilePath"] = callerFilePath;
            e.Properties["exception"] = ex?.Message;
            e.Properties["inner-exception"] = ex?.InnerException?.Message;
            e.Properties["stack_trace"] = ex?.StackTrace;
            e.Properties["env"] = logKey;
            e.Properties["host"] = hostName;
            e.Properties["invocation-id"] = invocationId;
            e.Properties["instance-id"] = functionInstanceId;



            // Adds custom properties to logZ
            if (customProperties != null)
                customProperties.ToList().ForEach(x => e.Properties[x.Key] = x.Value);

            logger.Log(e);

            SendConsoleMessage(msg + $" | Exception: {ex?.Message.ToString()} | Inner: {ex?.InnerException?.Message}", "error");
        }

        public void LogInfo(string message,
            [CallerMemberName] string method = "",
            [CallerFilePath]string callerFilePath = "",
            Dictionary<string, object> customProperties = null)
        {
            string className = GetClassNameFromCallerFilePath(callerFilePath);
            //logger.Info($"{className}|{method}|{message}");
            LogEventInfo e = new LogEventInfo();
            e.Message = message;
            e.Level = LogLevel.Info;

            e.Properties["method"] = method;
            e.Properties["callerFilePath"] = callerFilePath;
            e.Properties["env"] = logKey;
            e.Properties["host"] = hostName;
            e.Properties["invocation-id"] = invocationId;
            e.Properties["instance-id"] = functionInstanceId;



            // Adds custom properties to logZ
            if (customProperties != null)
                customProperties.ToList().ForEach(x => e.Properties[x.Key] = x.Value);

            logger.Log(e);

            SendConsoleMessage($"{className}|{method}|{message}", "info");
        }

        
        public void LogWarn(string message,
            [CallerMemberName] string method = "",
            [CallerFilePath]string callerFilePath = "",
            Dictionary<string, object> customProperties = null)
        {
            string className = GetClassNameFromCallerFilePath(callerFilePath);
            string msg = $"{className}|{method}|{message}";

            LogEventInfo e = new LogEventInfo();
            e.Message = message;
            e.Level = LogLevel.Warn;

            e.Properties["method"] = method;
            e.Properties["callerFilePath"] = callerFilePath;
            e.Properties["env"] = logKey;
            e.Properties["host"] = hostName;
            e.Properties["invocation-id"] = invocationId;
            e.Properties["instance-id"] = functionInstanceId;


            // Adds custom properties to logZ
            if (customProperties != null)
                customProperties.ToList().ForEach(x => e.Properties[x.Key] = x.Value);

            logger.Log(e);

            SendConsoleMessage(msg, "warn");
        }

        private void SendConsoleMessage(string msg, string msgType = "")
        {
            lock (myLock)
            {
                msgType = msgType.ToLower();

                switch (msgType)
                {
                    case "debug":
                        Console.ForegroundColor = ConsoleColor.DarkGray;
                        break;

                    case "warn":
                    case "warning":
                        Console.BackgroundColor = ConsoleColor.DarkMagenta;
                        Console.ForegroundColor = ConsoleColor.White;
                        break;

                    case "error":
                        Console.BackgroundColor = ConsoleColor.DarkRed;
                        Console.ForegroundColor = ConsoleColor.White;
                        break;

                    default:
                        break;
                }
                Console.WriteLine(String.Concat("[", DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss"), "] ", msgType.ToUpper(), "\t", msg));
                Console.ResetColor();
            }
        }
    }
}