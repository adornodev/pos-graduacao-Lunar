using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;

namespace Infra.Functions.Interfaces
{
    public interface ILoggerManager
    {

        void LogInfo(string message,
            [CallerMemberName] string method = "",
            [CallerFilePath]string callerFilePath = "",
            Dictionary<string, object> customProperties = null);

        void LogWarn(string message,
            [CallerMemberName] string method = "",
            [CallerFilePath]string callerFilePath = "",
            Dictionary<string, object> customProperties = null);

        void LogDebug(string message,
            [CallerMemberName] string method = "",
            [CallerFilePath]string callerFilePath = "",
            Dictionary<string, object> customProperties = null);

        void LogError(string message,
            [CallerMemberName] string method = "",
            [CallerFilePath]string callerFilePath = "",
            Exception ex = null,
            Dictionary<string, object> customProperties = null);
    }
}
